# USO_API_ROLES (roles-api) — Guía rápida

Esta guía explica cómo **ejecutar la API de roles** que usas en tu proyecto React y cómo probarla.

## 1) Requisitos
- Node.js 18+ (recomendado)
- npm
- La API de roles está dentro del proyecto en: `src/roles-api`

## 2) Arrancar la API de roles

### 2.1 Abrir terminal en la carpeta de la API
En PowerShell (Windows):

```powershell
cd C:\Users\javie\Desktop\Read\Proyecto_2ev\src\roles-api
```

(Si tu proyecto está en otra ruta, ajusta el `cd` C:\Users\javie\Desktop\Read\Proyecto_2ev\src\roles-api\src> npm run dev.)

### 2.2 Instalar dependencias
```powershell
npm install
```

### 2.3 Ejecutar en modo desarrollo
```powershell
npm run dev
```

Deberías ver en consola algo parecido a:
- `Server running on http://localhost:4000`

> Si el puerto cambia, actualiza la URL en tu `Login.jsx` (variable `ROLES_API_URL`).

---

## 3) Probar la API de roles

Tu frontend hace una petición POST a:

- **POST** `http://localhost:4000/role`

Body JSON (ejemplo):
```json
{ "username": "mor_2314" }
```

Respuesta esperada (ejemplo):
```json
{ "role": "admin" }
```
o
```json
{ "role": "user" }
```

### 3.1 Probar con PowerShell
```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:4000/role" `
  -ContentType "application/json" `
  -Body '{ "username": "mor_2314" }'
```

### 3.2 Probar con curl (si lo tienes)
```bash
curl -X POST http://localhost:4000/role \
  -H "Content-Type: application/json" \
  -d '{ "username": "mor_2314" }'
```

---

## 4) Arrancar el frontend (React + Vite)

En otra terminal, en la **raíz del proyecto** (`Proyecto_2ev`):

```powershell
cd C:\Users\javie\Desktop\Read\Proyecto_2ev
npm install
npm run dev
```

Abrir:
- `http://localhost:5173`

---

## 5) Cómo funciona el login en tu proyecto (resumen)

Tu `Login.jsx` hace dos cosas:

1) Login (token) usando Fake Store API:
- `login(username, password)` (desde `services/fakeStoreApi.js`)

2) Obtiene el rol desde tu API de roles:
- POST `http://localhost:4000/role` con `{ username }`
- Si falla, asume rol `"user"`

3) Guarda sesión en Zustand:
- `setSession({ token, role, username })`

4) Redirige:
- si `role === "admin"` → `/admin`
- si no → `/`

> Importante: asegúrate de que tu API devuelve el rol en minúsculas (`"admin"` / `"user"`) porque tu frontend compara con `"admin"`.

---

## 6) Cambiar URL de la API de roles
En `src/pages/Login.jsx`:

```js
const ROLES_API_URL = "http://localhost:4000/role";
```

Si tu API corre en otro puerto o ruta, cambia esa constante.

---

## 7) Errores típicos y solución rápida

### “Failed to fetch” o CORS
- Asegúrate de que la API está ejecutándose.
- Confirma que la API tiene `cors()` habilitado.
- Confirma el puerto correcto.

### “Missing script: dev”
- En `src/roles-api/package.json` debe existir:
```json
"scripts": { "dev": "nodemon src/server.js" }
```

### “Cannot find module / package.json”
- Estás en la carpeta equivocada. Debe ser: `src/roles-api`.
