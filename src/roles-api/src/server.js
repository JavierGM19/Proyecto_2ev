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

// --- Persistencia simple en JSON ---
const DATA_DIR = path.resolve("src/data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Usuarios por defecto (puedes cambiarlos)
const DEFAULT_USERS = [
    { username: "mor_2314", role: "admin" },
    { username: "johnd", role: "user" },
    { username: "guest_demo", role: "guest" },
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

// --- Rutas ---
app.get("/", (_req, res) =>
    res.json({ ok: true, message: "roles-api running" })
);

// POST /role (lo que ya usabas): devuelve rol según username (lee del JSON)
app.post("/role", (req, res) => {
    const { username } = req.body || {};
    if (!username) return res.status(400).json({ message: "Missing username" });

    const users = readUsers();
    const u = users.find((x) => x.username === username);

    // Si no existe, por defecto user (decisión simple)
    return res.json({ role: u?.role || "user" });
});

// GET /users: lista usuarios con rol
app.get("/users", (_req, res) => {
    const users = readUsers();
    return res.json(users);
});

// PATCH /users/:username/role: cambia rol (guest/user/admin) y lo guarda
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
        // Si no existe, lo creamos (simple)
        const created = { username, role: newRole };
        users.push(created);
        writeUsers(users);
        return res.status(201).json(created);
    }

    users[idx] = { ...users[idx], role: newRole };
    writeUsers(users);
    return res.json(users[idx]);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
