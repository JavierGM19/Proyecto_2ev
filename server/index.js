import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.resolve("./roles.json");

function readRoles() {
    if (!fs.existsSync(DATA_PATH)) {
        fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));
    }
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw || "{}");
}

function writeRoles(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Devuelve rol; si no existe el usuario lo crea como "user"
app.post("/role", (req, res) => {
    const { username } = req.body;

    if (!username || typeof username !== "string") {
        return res.status(400).json({ error: "username requerido" });
    }

    const roles = readRoles();

    if (!roles[username]) {
        roles[username] = { role: "user" };
        writeRoles(roles);
    }

    return res.json({ role: roles[username].role });
});

// (Opcional) listar (para debug)
app.get("/roles", (req, res) => {
    const roles = readRoles();
    res.json(roles);
});

app.listen(4000, () => {
    console.log("Roles API running on http://localhost:4000");
});
