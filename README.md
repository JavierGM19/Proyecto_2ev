# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## API de roles local

Guía rápida de uso/integración (API ya creada): `USO_API_ROLES.txt`.

### Arranque rápido (frontend + backend)

1. Frontend:
   - `npm install`
   - `npm run dev`
2. Backend de roles (en otra terminal):
   - `cd src/roles-api`
   - `npm install`
   - `npm run start`

### Dónde se guardan los usuarios registrados

Los usuarios se guardan en el fichero JSON del backend:

- `src/roles-api/src/data/users.json`

Así los registros no dependen de `localStorage` del navegador.

### Si aparece “No se pudo conectar con la API de roles”

Comprueba estas causas típicas:

1. La API no está levantada:
   - `cd src/roles-api`
   - `npm install`
   - `npm run start`
2. La URL del frontend no coincide con la API:
   - Por defecto se usa `http://localhost:4000`
   - Puedes cambiarla con `VITE_ROLES_API_URL` en un `.env`
3. CORS o red bloqueada:
   - Verifica en consola del navegador si hay error CORS/Network
4. Dependencias backend incompletas:
   - Si falta `express`, reinstala dependencias en `src/roles-api`


5. Cambio importante respecto a versiones anteriores:
   - Antes el panel admin podía leer usuarios locales sin backend.
   - Ahora el panel de administración prioriza la API de roles (`/users` y `PATCH /users/:username/role`) para editar roles, y solo usa modo local como respaldo de lectura.

### Responsive + Bootstrap

- Se añadieron breakpoints explícitos para `990px`, `767px`, `510px` y `480px` en `src/index.css`.
- Se incorporó Bootstrap 5 (CDN) en `index.html` y se usan clases Bootstrap en header/login/admin (`btn`, `form-control`, `form-select`, `alert`, `row`, `col-*`).

### Registro de usuarios

- El registro de usuarios desde la web usa `POST /register` de la roles-api; esos usuarios se guardan en `src/roles-api/src/data/users.json` (no en FakeStore).
