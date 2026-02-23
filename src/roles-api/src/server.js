import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MASTER_ADMIN_USERNAME = "mor_2314";

// --- Persistencia simple en JSON ---
const DATA_DIR = path.resolve("src/data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

const DEFAULT_USERS = [
  { username: MASTER_ADMIN_USERNAME, password: "83r5^_", role: "admin" },
  { username: "johnd", password: "m38rmF$", role: "user" },
  { username: "guest_demo", password: "guest123", role: "guest" },
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2), "utf-8");
  }
}

function readUsers() {
  ensureDataFile();
  const raw = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeUsers(users) {
  ensureDataFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

function normalizeRole(role) {
  const r = String(role || "").toLowerCase();
  if (r === "guest" || r === "user" || r === "admin") return r;
  return null;
}

function publicUser(user) {
  return {
    username: user.username,
    role: user.role,
  };
}

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "roles-api running" });
});

app.post("/role", (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ message: "Missing username" });

  const users = readUsers();
  const u = users.find((x) => x.username === username);

  return res.json({ role: u?.role || "user" });
});

app.get("/users", (_req, res) => {
  const users = readUsers().map(publicUser);
  return res.json(users);
});

app.post("/login-local", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "Faltan usuario o contraseña" });
  }

  if (username === MASTER_ADMIN_USERNAME) {
    return res.status(400).json({ message: "Este usuario se valida en FakeStore" });
  }

  const users = readUsers();
  const user = users.find(
    (item) => item.username === username && item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  return res.json({
    token: `local-token-${user.username}`,
    username: user.username,
    role: user.role,
  });
});

app.post("/register", (req, res) => {
  const { username, password, role } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
  }

  if (username === MASTER_ADMIN_USERNAME) {
    return res.status(400).json({ message: "Ese usuario está reservado para el admin maestro" });
  }

  const safeRole = normalizeRole(role) || "user";
  const users = readUsers();

  if (users.some((item) => item.username === username)) {
    return res.status(400).json({ message: "Ese usuario ya existe" });
  }

  const created = { username, password, role: safeRole };
  users.push(created);
  writeUsers(users);

  return res.status(201).json(publicUser(created));
});

app.patch("/users/:username/role", (req, res) => {
  const { username } = req.params;
  const { role } = req.body || {};

  const newRole = normalizeRole(role);
  if (!newRole) {
    return res.status(400).json({ message: "role must be: guest | user | admin" });
  }

  const users = readUsers();
  const idx = users.findIndex((x) => x.username === username);

  if (idx === -1) {
    const created = { username, password: "1234", role: newRole };
    users.push(created);
    writeUsers(users);
    return res.status(201).json(publicUser(created));
  }

  users[idx] = { ...users[idx], role: newRole };
  writeUsers(users);
  return res.json(publicUser(users[idx]));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
