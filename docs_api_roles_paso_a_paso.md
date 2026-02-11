# API de roles local (paso a paso)

Este documento te deja la API local de roles funcionando en `http://localhost:4000/role` para usarla con el login del frontend.

> Flujo final esperado:
> 1) Frontend hace login a Fake Store (`/auth/login`).
> 2) Frontend consulta esta API local (`POST /role`) con `{ "username": "..." }`.
> 3) La API devuelve `{ "role": "user" | "employee" | "admin" }`.

---

## 0) Requisitos

- Tener instalado Node.js LTS (incluye npm).
- Tener este repo ya clonado.

Comandos para comprobar:

```bash
node -v
npm -v
```

---

## 1) Crear carpeta para la API de roles

Desde la raíz del proyecto (`Proyecto_2ev`):

```bash
mkdir -p roles-api
cd roles-api
npm init -y
```

---

## 2) Instalar dependencias

```bash
npm i express cors
npm i -D nodemon
```

---

## 3) Crear `roles.json`

```bash
cat > roles.json <<'JSON'
{
  "users": {
    "mor_2314": { "role": "admin" },
    "johnd": { "role": "employee" }
  }
}
JSON
```

---

## 4) Crear `server.js`

```bash
cat > server.js <<'JS'
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
JS
```

---

## 5) Añadir scripts en `roles-api/package.json`

Abre `roles-api/package.json` y deja los scripts así:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

---

## 6) Levantar la API

Dentro de `roles-api`:

```bash
npm run dev
```

Deberías ver:

```txt
Roles API escuchando en http://localhost:4000
```

---

## 7) Probar endpoint manualmente

En otra terminal (sin cerrar la API):

```bash
curl -X POST http://localhost:4000/role \
  -H "Content-Type: application/json" \
  -d '{"username":"mor_2314"}'
```

Respuesta esperada (ejemplo):

```json
{ "role": "admin" }
```

Si usas un usuario nuevo:

```bash
curl -X POST http://localhost:4000/role \
  -H "Content-Type: application/json" \
  -d '{"username":"usuario_nuevo"}'
```

Respuesta esperada:

```json
{ "role": "user" }
```

Y quedará guardado automáticamente en `roles.json`.

---

## 8) Levantar el frontend

Desde la raíz del proyecto (`Proyecto_2ev`):

```bash
npm install
npm run dev
```

Importante: deja la API en ejecución en paralelo en `localhost:4000`.

---

## 9) Login de prueba

Credenciales de Fake Store:

- `username: mor_2314`
- `password: 83r5^_`

Comportamiento esperado:

1. Fake Store devuelve token.
2. Frontend consulta `POST http://localhost:4000/role`.
3. Se guarda sesión con `token + role + username`.
4. Si role es `admin`, redirige a `/admin`; si no, a `/`.

---

## 10) Comandos rápidos (resumen)

### Terminal A (API)

```bash
cd roles-api
npm run dev
```

### Terminal B (Frontend)

```bash
npm run dev
```

---

## 11) Solución de problemas

### Error `Failed to fetch` al pedir `/role`

- Verifica que la API está levantada en puerto 4000.
- Verifica que no tienes otro proceso ocupando el puerto.

Comando para comprobar puerto en uso:

```bash
lsof -i :4000
```

### CORS

Ya está habilitado con `app.use(cors())`.

### Usuario sin rol

La API lo crea automáticamente como `user` en `roles.json`.
