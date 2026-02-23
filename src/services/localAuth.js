import seedUsers from "../data/localUsers.json";

const API_BASE = "http://localhost:4000";
const MASTER_ADMIN_USERNAME = "mor_2314";

function normalizeUser(user) {
  return {
    username: user.username,
    role: user.role,
  };
}

function getFallbackUsers() {
  return [
    { username: MASTER_ADMIN_USERNAME, role: "admin" },
    ...seedUsers.map(normalizeUser),
  ];
}

async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    let data = null;

    try {
      data = await res.json();
    } catch {
      data = null;
    }

    return { res, data };
  } catch {
    throw new Error(
      "No se pudo conectar con la API de roles. Arranca el backend en http://localhost:4000"
    );
  }
}

export async function getRegisteredUsers() {
  try {
    const { res, data } = await fetchJson(`${API_BASE}/users`);

    if (!res.ok) {
      throw new Error("No se pudieron cargar los usuarios");
    }

    return Array.isArray(data) ? data.map(normalizeUser) : getFallbackUsers();
  } catch (err) {
    if (String(err?.message || "").includes("No se pudo conectar")) {
      return getFallbackUsers();
    }

    throw err;
  }
}

export async function updateUserRole(username, role) {
  const { res, data } = await fetchJson(
    `${API_BASE}/users/${encodeURIComponent(username)}/role`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    }
  );

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

  const { res, data } = await fetchJson(`${API_BASE}/login-local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: cleanUsername, password }),
  });

  if (!res.ok) {
    throw new Error(data?.message || "Credenciales incorrectas");
  }

  return data;
}

export async function registerLocal({ username, password, role }) {
  const cleanUsername = username.trim();

  const { res, data } = await fetchJson(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: cleanUsername, password, role }),
  });

  if (!res.ok) {
    throw new Error(data?.message || "No se pudo registrar el usuario");
  }

  return normalizeUser(data);
}
