import { useState, useEffect, useCallback } from "react";
import API from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import TaskColumn from "../components/TaskColumn.jsx";
import TaskModal from "../components/TaskModal.jsx";

const STAGES = ["Todo", "In Progress", "Done"];

function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStage, setDefaultStage] = useState("Todo");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const { data } = await API.get("/api/tasks");
      setTasks(data);
    } catch (err) {
      setFetchError(
        err.response?.data?.message || "Failed to load tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Group tasks by stage
  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = tasks.filter((t) => t.stage === stage);
    return acc;
  }, {});

  // --- Handlers ---

  const handleAddTask = (stage) => {
    setEditingTask(null);
    setDefaultStage(stage);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setDefaultStage(task.stage);
    setModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/api/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleStageChange = async (taskId, newStage) => {
    try {
      const { data } = await API.put(`/api/tasks/${taskId}`, { stage: newStage });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update stage");
    }
  };

  const handleModalSave = (savedTask) => {
    setTasks((prev) => {
      const exists = prev.find((t) => t._id === savedTask._id);
      if (exists) {
        return prev.map((t) => (t._id === savedTask._id ? savedTask : t));
      }
      return [savedTask, ...prev];
    });
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header" id="dashboard-header">
        <div className="header-brand">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="12" fill="#022A23" />
            <path d="M12 20L17 25L28 14" stroke="#E7B961" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="header-title">TaskFlow</span>
        </div>
        <div className="header-right">
          <span className="header-email">{user?.email}</span>
          <button className="btn btn-outline btn-sm" onClick={logout} id="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-main">
        {loading && (
          <div className="board-loading">
            <div className="spinner" />
            <p>Loading your tasks...</p>
          </div>
        )}

        {!loading && fetchError && (
          <div className="error-banner board-error" id="fetch-error-banner">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <span>{fetchError}</span>
            <button className="btn btn-sm btn-primary" onClick={fetchTasks}>
              Retry
            </button>
          </div>
        )}

        {!loading && !fetchError && (
          <div className="board">
            {STAGES.map((stage) => (
              <TaskColumn
                key={stage}
                title={stage}
                tasks={grouped[stage]}
                onAddTask={() => handleAddTask(stage)}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onStageChange={handleStageChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleModalSave}
        initialData={editingTask}
        defaultStage={defaultStage}
      />
    </div>
  );
}

export default Dashboard;
