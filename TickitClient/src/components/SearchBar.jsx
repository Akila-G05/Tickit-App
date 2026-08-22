export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        className="input"
        type="search"
        placeholder="Search notes…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
