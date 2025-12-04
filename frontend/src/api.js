// src/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* ---------------------------------------------
   Helpers
---------------------------------------------- */

// Always read token fresh from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Safe JSON parsing to avoid crash for empty bodies
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Build string for query parameters
function qs(params) {
  return new URLSearchParams(params).toString();
}

// Normalize server error body into a single string
function formatErrorBody(body) {
  if (!body) return null;
  if (typeof body === "string") return body;
  if (body.message) return body.message;
  if (Array.isArray(body.errors)) return body.errors.join(", ");
  if (body.error) return body.error;
  return JSON.stringify(body);
}

/* ---------------------------------------------
   Developers CRUD
---------------------------------------------- */

// GET developers with search, filter, sorting, pagination
export async function fetchDevelopers({
  page = 1,
  limit = 10,
  search = "",
  role = "",
  sort = "experience",
  order = "desc",
} = {}) {
  const url = `${API_BASE}/developers?${qs({
    page,
    limit,
    search,
    role,
    sort,
    order,
  })}`;

  const res = await fetch(url, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const body = await safeJson(res);

  if (!res.ok) {
    throw new Error(formatErrorBody(body) || `Failed to fetch developers (${res.status})`);
  }

  // If backend returns { success: true, data: [...], total, page } return data + meta
  if (body && typeof body === "object" && ("data" in body || "total" in body)) {
    return body;
  }

  // otherwise return raw body (could be an array)
  return body;
}

// POST new developer
export async function createDeveloper(payload) {
  const res = await fetch(`${API_BASE}/developers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const body = await safeJson(res);

  if (!res.ok) {
    throw new Error(
      formatErrorBody(body) || `Failed to create developer (${res.status})`
    );
  }

  // backend typically returns the saved developer object
  return body;
}

// PUT update developer
export async function updateDeveloper(id, payload) {
  const res = await fetch(`${API_BASE}/developers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const body = await safeJson(res);

  if (!res.ok) {
    throw new Error(
      formatErrorBody(body) || `Failed to update developer (${res.status})`
    );
  }

  return body;
}

// DELETE developer
export async function deleteDeveloper(id) {
  const res = await fetch(`${API_BASE}/developers/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  const body = await safeJson(res);

  if (!res.ok) {
    throw new Error(formatErrorBody(body) || `Failed to delete developer (${res.status})`);
  }

  return body;
}

/* ---------------------------------------------
   Auth: signup + login + get current user
---------------------------------------------- */

// Signup
export async function signup(data) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await safeJson(res);

  if (!res.ok) {
    throw new Error(formatErrorBody(body) || `Signup failed (${res.status})`);
  }

  return body; // includes token + user
}

// Login
export async function login(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await safeJson(res);

  if (!res.ok) {
    throw new Error(formatErrorBody(body) || `Login failed (${res.status})`);
  }

  return body; // includes token + user
}

// Get developer by ID
export async function fetchDeveloperById(id) {
  const res = await fetch(`${API_BASE}/developers/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const body = await safeJson(res);

  if (!res.ok) {
    throw new Error(formatErrorBody(body) || `Failed to fetch developer (${res.status})`);
  }

  // If backend returned { success: true, data: developer } return developer
  if (body && typeof body === "object" && "data" in body) {
    return body.data;
  }

  return body;
}
