import { useState, useEffect, useRef } from "react";
import API from "../api/axios.js";

const STAGES = ["Todo", "In Progress", "Done"];

function TaskModal({ isOpen, onClose, onSave, initialData, defaultStage }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState("Todo");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const overlayRef = useRef(null);
  const titleRef = useRef(null);

  const isEdit = !!initialData;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setStage(initialData.stage || "Todo");
      } else {
        setTitle("");
        setDescription("");
        setStage(defaultStage || "Todo");
      }
      setError("");
      setSaving(false);

      // Focus title input
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, initialData, defaultStage]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        const { data } = await API.put(`/api/tasks/${initialData._id}`, {
          title: title.trim(),
          description: description.trim(),
          stage,
        });
        onSave(data);
      } else {
        const { data } = await API.post("/api/tasks", {
          title: title.trim(),
          description: description.trim(),
          stage,
        });
        onSave(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true" id="task-modal">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Task" : "New Task"}</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal" id="modal-close-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="error-banner modal-error">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={titleRef}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              placeholder="Add some details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-stage">Stage</label>
            <select
              id="task-stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              disabled={saving}
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving} id="task-save-btn">
              {saving ? <span className="btn-spinner" /> : isEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
