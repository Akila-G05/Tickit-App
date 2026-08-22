const API_URL = "http://localhost:8080/tasks";

async function handleResponse(resp) {
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Request failed (${resp.status}): ${body}`);
  }
  return resp.json();
}

export function getTasks(search = "") {
  const qs = search ? `?search=${encodeURIComponent(search)}` : "";
  return fetch(`${API_URL}${qs}`).then(handleResponse);
}

export function createTask(title, description) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      created_date: new Date().toLocaleString(),
    }),
  }).then(handleResponse);
}

export function updateTask(id, title, description) {
  return fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, title, description }),
  }).then(handleResponse);
}

export function deleteTask(id) {
  return fetch(`${API_URL}?id=${id}`, { method: "DELETE" }).then(handleResponse);
}
