import { useState } from "react";

export default function TaskForm({ initialTask, onSave, onCancel }) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      await onSave(title.trim(), description.trim());
      setTitle("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="Note title…"
        value={title}
        maxLength={50}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="input"
        placeholder="Write your note… (optional)"
        value={description}
        rows={3}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="form-actions">
        {initialTask && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn primary" disabled={!title.trim() || saving}>
          {initialTask ? "Save changes" : "Add note"}
        </button>
      </div>
    </form>
  );
}
