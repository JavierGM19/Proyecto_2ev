import seedUsers from "../data/localUsers.json";

const STORAGE_KEY = "daw-users-db";

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

export function getRegisteredUsers() {
  return readUsers();
}
