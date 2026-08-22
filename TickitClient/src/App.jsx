import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "./api.js";
import SearchBar from "./components/SearchBar.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async (term = search) => {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks(term);
      setTasks(data);
    } catch (e) {
      setError(e.message || "Could not reach the server");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadTasks("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadTasks(search), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleSave(title, description) {
    if (editingTask) {
      await updateTask(editingTask.id, title, description);
      setEditingTask(null);
    } else {
      await createTask(title, description);
    }
    await loadTasks(search);
  }

  async function handleDelete(id) {
    await deleteTask(id);
    if (editingTask && editingTask.id === id) setEditingTask(null);
    await loadTasks(search);
  }

  function handleEdit(task) {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app">
      <header className="header">
        <h1>
          <span className="logo">✔</span> Tickit
        </h1>
        <p className="subtitle">Your notes, all in one place.</p>
      </header>

      {error && <div className="alert">{error}</div>}

      <TaskForm
        key={editingTask ? editingTask.id : "new"}
        initialTask={editingTask}
        onSave={handleSave}
        onCancel={() => setEditingTask(null)}
      />

      <SearchBar value={search} onChange={setSearch} />

      {loading ? (
        <p className="status">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="status">No notes found. Add one above!</p>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editingId={editingTask?.id}
        />
      )}
    </div>
  );
}
