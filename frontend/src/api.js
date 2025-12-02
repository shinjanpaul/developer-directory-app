// src/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function fetchDevelopers() {
  const res = await fetch(`${API_BASE}/developers`);
  if (!res.ok) throw new Error('Failed to fetch developers');
  return res.json();
}

export async function createDeveloper(payload) {
  const res = await fetch(`${API_BASE}/developers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create developer');
  }
  return res.json();
}
