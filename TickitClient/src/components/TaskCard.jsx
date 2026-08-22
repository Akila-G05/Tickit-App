export default function TaskCard({ task, onEdit, onDelete, isEditing }) {
  return (
    <li className={`task-card${isEditing ? " editing" : ""}`}>
      <div className="task-body">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        {task.created_date && <time>{task.created_date}</time>}
      </div>
      <div className="task-actions">
        <button type="button" className="btn small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="btn small danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}
