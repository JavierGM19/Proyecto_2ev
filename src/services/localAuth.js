import seedUsers from "../data/localUsers.json";

const STORAGE_KEY = "daw-users-db";
const MASTER_ADMIN_USERNAME = "mor_2314";

function readUsers() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedUsers));
    return [...seedUsers];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...seedUsers];
  } catch {
    return [...seedUsers];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getRegisteredUsers() {
  return readUsers();
}

export function loginLocal(username, password) {
  const users = readUsers();
  const cleanUsername = username.trim();

  const user = users.find(
    (item) => item.username === cleanUsername && item.password === password
  );

  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

  return {
    token: `local-token-${user.username}`,
    username: user.username,
    role: user.role,
  };
}

export function registerLocal({ username, password, role }) {
  const users = readUsers();
  const cleanUsername = username.trim();

  if (!cleanUsername || !password) {
    throw new Error("Usuario y contraseña son obligatorios");
  }

  if (cleanUsername === MASTER_ADMIN_USERNAME) {
    throw new Error("Ese usuario está reservado para el admin maestro");
  }

  if (users.some((item) => item.username === cleanUsername)) {
    throw new Error("Ese usuario ya existe");
  }

  const allowedRoles = ["user", "guest", "admin"];
  const safeRole = allowedRoles.includes(role) ? role : "user";

  const nextUsers = [
    ...users,
    { username: cleanUsername, password, role: safeRole },
  ];

  saveUsers(nextUsers);
}
