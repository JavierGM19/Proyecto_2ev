# Guia rapida del proyecto

Este documento resume que hace cada parte del proyecto y para que sirve.

## 1) Scripts

### Frontend (`package.json`)
- `npm run dev`: arranca Vite en desarrollo.
- `npm run build`: genera la version de produccion en `dist/`.
- `npm run preview`: sirve localmente la build de `dist/`.
- `npm run lint`: ejecuta ESLint en todo el proyecto.

### API local (`src/roles-api/package.json`)
- `npm run start`: arranca la API local con Node.
- `npm run dev`: arranca la API local con nodemon (recarga automatica).

## 2) Flujo general de la app

1. `src/main.jsx` monta React con:
   - `RouterProvider` para rutas
   - `QueryClientProvider` para peticiones y cache
2. `src/app/router.jsx` define las rutas publicas y protegidas.
3. `src/layouts/PublicLayout.jsx` aplica estructura comun (`Header` + contenido + `Footer`).
4. `src/routes/ProtectedRoute.jsx` controla acceso por login y rol.

## 3) Paginas (`src/pages`)

- `Home.jsx`: listado de productos, busqueda y filtro por categoria.
- `ProductosDetail.jsx`: detalle de un producto y alta al carrito.
- `Login.jsx`: login y registro (FakeStore para admin maestro + API local para usuarios normales).
- `Admin.jsx`: panel para ver usuarios, cambiar roles y borrar usuarios.
- `InfoApi.jsx`: resumen de FakeStore y resumen de API local (usuarios/roles y funciones).

## 4) Componentes (`src/components`)

- `Header.jsx`: navegacion, buscador, acceso admin y botones de sesion/carrito.
- `Footer.jsx`: pie de pagina.
- `ProductCard.jsx`: tarjeta de producto.
- `CartModal.jsx`: modal del carrito (listar, quitar, comprar simulado).

## 5) Servicios (`src/services`)

- `fakeStoreApi.js`: cliente de FakeStore (productos, categorias, login admin).
- `rolesApi.js`: cliente de la API local (`/users`, `/role`, `/login-local`, `/register`, etc).
- `localAuth.js`: fallback local de usuarios guardados en `localStorage`.

## 6) Estado global (`src/store`)

- `authStore.js`: estado de sesion persistido en `localStorage`.
- `cartStore.js`: estado del carrito persistido por pestana en `sessionStorage`.

## 7) API local (`src/roles-api/src/server.js`)

Endpoints principales:
- `GET /`: healthcheck.
- `POST /role`: devuelve rol por `username`.
- `GET /users`: lista usuarios sin password.
- `POST /login-local`: login local.
- `POST /register`: registro de usuario.
- `PATCH /users/:username/role`: cambio de rol.
- `DELETE /users/:username`: borrado de usuario.

Datos:
- Usuarios guardados en `src/roles-api/src/data/users.json`.

## 8) Estilos y recursos

- `src/index.css`: estilos globales y responsive (breakpoints 990, 767, 510, 480).
- `index.html`: carga Bootstrap por CDN y monta `#root`.
- `src/data/localUsers.json`: usuarios semilla para fallback local.

## 9) CI/CD y despliegue

- `.github/workflows/deploy.yml`: build y despliegue a GitHub Pages.
- `vite.config.js`: usa `base '/Proyecto_2ev/'` en Actions para resolver rutas en Pages.
