

async function apiGet(url) {
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return await res.json();
}

async function apiPost(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
  return await res.json();
}

async function apiPut(url, data) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${url} failed: ${res.status}`);
  return await res.json();
}

async function apiDelete(url) {
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'same-origin',
  });
  if (!res.ok) throw new Error(`DELETE ${url} failed: ${res.status}`);
  return await res.json();
}

export { apiGet, apiPost, apiPut, apiDelete };
