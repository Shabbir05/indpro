import TaskCard from "./TaskCard.jsx";

const STAGE_ICONS = {
  Todo: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="#9A9A9A" strokeWidth="1.5" />
    </svg>
  ),
  "In Progress": (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="#E7B961" strokeWidth="1.5" />
      <path d="M9 1A8 8 0 019 17" fill="#E7B961" />
    </svg>
  ),
  Done: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" fill="#1C4038" stroke="#1C4038" strokeWidth="1.5" />
      <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="#E7B961" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function TaskColumn({ title, tasks, onAddTask, onEditTask, onDeleteTask, onStageChange }) {
  return (
    <div className="task-column" id={`column-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="column-header">
        <div className="column-title-group">
          {STAGE_ICONS[title]}
          <h2 className="column-title">{title}</h2>
          <span className="column-count">{tasks?.length || 0}</span>
        </div>
      </div>

      <div className="column-body">
        {(!tasks || tasks.length === 0) && (
          <div className="column-empty">
            <p>No tasks yet</p>
          </div>
        )}

        {tasks &&
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStageChange={onStageChange}
            />
          ))}
      </div>

      <button className="btn btn-add-task" onClick={onAddTask} id={`add-task-${title.toLowerCase().replace(/\s+/g, "-")}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M7.25 7.25V3.75a.75.75 0 011.5 0v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5h-3.5a.75.75 0 010-1.5h3.5z" />
        </svg>
        Add Task
      </button>
    </div>
  );
}

export default TaskColumn;
