const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;
const DB_PATH = path.join(__dirname, "roles.json");

app.use(cors());
app.use(express.json());

function readDb() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDb(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.post("/role", (req, res) => {
    const username = (req.body?.username || "").trim();

    if (!username) {
        return res.status(400).json({ message: "username es obligatorio" });
    }

    const db = readDb();

    if (!db.users[username]) {
        db.users[username] = { role: "user" };
        writeDb(db);
    }

    return res.json({ role: db.users[username].role });
});

app.listen(PORT, () => {
    console.log(`Roles API escuchando en http://localhost:${PORT}`);
});