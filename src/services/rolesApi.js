export const ROLES_API_BASE_URL = (
  import.meta.env.VITE_ROLES_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

const REQUEST_TIMEOUT_MS = 5000;

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function buildConnectionError() {
  return new Error(
    "No se pudo conectar con la API de roles. Revisa que esté arrancada (npm run start en src/roles-api), la URL VITE_ROLES_API_URL y CORS."
  );
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;

  try {
    response = await fetch(`${ROLES_API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
    });
  } catch {
    throw buildConnectionError();
  } finally {
    clearTimeout(timeoutId);
  }

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(data?.message || "Error al consultar la API de roles");
  }

  return data;
}

export async function fetchRoleByUsername(username) {
  const data = await request("/role", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  return data?.role || "user";
}

export async function fetchUsers() {
  const data = await request("/users");
  return Array.isArray(data) ? data : [];
}

export async function updateUserRole(username, role) {
  return request(`/users/${encodeURIComponent(username)}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
}
