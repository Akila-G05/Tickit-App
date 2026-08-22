import TaskCard from "./TaskCard.jsx";

export default function TaskList({ tasks, onEdit, onDelete, editingId }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isEditing={editingId === task.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
