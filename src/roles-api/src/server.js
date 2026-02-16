import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) =>
    res.json({ ok: true, message: "roles-api running" })
);

// 🔥 Endpoint que usa tu Login.jsx
app.post("/role", (req, res) => {
    const { username } = req.body;

    if (username === "mor_2314") {
        return res.json({ role: "admin" });
    }

    return res.json({ role: "user" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
