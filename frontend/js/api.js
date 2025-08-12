// Get API base from environment variable or default to localhost for dev
const API_BASE_URL = 
  window?.env?.REACT_APP_API_URL ||           // If using injected config
  (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) || 
  "http://localhost:3000";                    // Fallback for local dev

async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return await res.json();
}

async function apiPost(path, data) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return await res.json();
}

async function apiPut(path, data) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return await res.json();
}

async function apiDelete(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return await res.json();
}

export { apiGet, apiPost, apiPut, apiDelete };
