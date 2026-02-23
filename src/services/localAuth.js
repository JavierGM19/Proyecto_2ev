const API_BASE = "http://localhost:4000";
const MASTER_ADMIN_USERNAME = "mor_2314";

function normalizeUser(user) {
  return {
    username: user.username,
    role: user.role,
  };
}

export async function getRegisteredUsers() {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) {
    throw new Error("No se pudieron cargar los usuarios");
  }

  const users = await res.json();
  return users.map(normalizeUser);
}

export async function updateUserRole(username, role) {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(username)}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "No se pudo actualizar el rol");
  }

  return normalizeUser(data);
}

export async function loginLocal(username, password) {
  const cleanUsername = username.trim();

  if (cleanUsername === MASTER_ADMIN_USERNAME) {
    throw new Error("Este usuario se valida con FakeStore");
  }

  const res = await fetch(`${API_BASE}/login-local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: cleanUsername, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Credenciales incorrectas");
  }

  return data;
}

export async function registerLocal({ username, password, role }) {
  const cleanUsername = username.trim();

  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: cleanUsername, password, role }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "No se pudo registrar el usuario");
  }

  return normalizeUser(data);
}