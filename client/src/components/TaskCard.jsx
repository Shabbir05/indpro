import { useState } from "react";

const STAGE_COLORS = {
  Todo: "badge-grey",
  "In Progress": "badge-blue",
  Done: "badge-green",
};

const STAGES = ["Todo", "In Progress", "Done"];

function TaskCard({ task, onEdit, onDelete, onStageChange }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await onDelete(task._id);
    } catch {
      // error handled in parent
    } finally {
      setActionLoading(false);
      setConfirmDelete(false);
    }
  };

  const handleStageChange = async (e) => {
    const newStage = e.target.value;
    if (newStage === task.stage) return;
    setActionLoading(true);
    try {
      await onStageChange(task._id, newStage);
    } catch {
      // error handled in parent
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={`task-card ${actionLoading ? "task-card--loading" : ""}`} id={`task-${task._id}`}>
      {actionLoading && <div className="card-loading-overlay" />}

      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`badge ${STAGE_COLORS[task.stage] || "badge-grey"}`}>
          {task.stage}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <select
          className="stage-select"
          value={task.stage}
          onChange={handleStageChange}
          disabled={actionLoading}
          aria-label="Change stage"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="task-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(task)}
            disabled={actionLoading}
            title="Edit task"
            aria-label="Edit task"
          >
            {/* Pencil icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L3.463 11.098a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.25.25 0 00.108-.064l8.61-8.61a.25.25 0 000-.354L12.427 2.487z" />
            </svg>
          </button>

          {!confirmDelete ? (
            <button
              className="btn-icon btn-icon--danger"
              onClick={() => setConfirmDelete(true)}
              disabled={actionLoading}
              title="Delete task"
              aria-label="Delete task"
            >
              {/* Trash icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zM11 3V1.75A1.75 1.75 0 009.25 0h-2.5A1.75 1.75 0 005 1.75V3H2.75a.75.75 0 000 1.5h.68l.806 7.27A1.75 1.75 0 005.98 13.5h4.04a1.75 1.75 0 001.744-1.73l.806-7.27h.68a.75.75 0 000-1.5H11zm-5.97 1.5l.79 7.13a.25.25 0 00.249.247h4.04a.25.25 0 00.249-.247l.79-7.13H5.03z" />
              </svg>
            </button>
          ) : (
            <div className="confirm-delete">
              <span>Sure?</span>
              <button className="btn-text btn-text--danger" onClick={handleDelete} disabled={actionLoading}>
                Yes
              </button>
              <button className="btn-text" onClick={() => setConfirmDelete(false)} disabled={actionLoading}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
