# Proyecto 2ev - DAW Shop

## Descripcion del proyecto
Este proyecto es una tienda online hecha con React para la asignatura de DAW.
La app tiene:
- listado de productos consumiendo FakeStore API
- buscador y filtro por categoria
- detalle de producto
- carrito de compra
- login
- panel de admin con gestion de usuarios y roles

Hay dos tipos de acceso:
- usuario normal
- admin (ruta protegida)

Tambien usamos una API local (`src/roles-api`) para login local, registro, cambio de rol y borrado de usuario.

## Framework y librerias (con versiones)

### Frontend
- react `^19.2.0`
- react-dom `^19.2.0`
- react-router-dom `^7.13.0`
- @tanstack/react-query `^5.90.20`
- zustand `^5.0.11`
- vite `^7.3.1`
- tailwindcss `^4.1.18` (instalado)
- bootstrap `5.3.3` por CDN en `index.html`

### API local (`src/roles-api`)
- express `^5.2.1`
- cors `^2.8.6`
- dotenv `^17.3.1`
- jsonwebtoken `^9.0.3`
- zod `^4.3.6`
- nodemon `^3.1.11` (dev)

## Estado de requisitos del enunciado
- Rutas en React: si
- Consumo API GET y POST: si (ademas PATCH y DELETE)
- Responsive (990, 767, 510, 480): si
- Login + zona usuario/admin: si
- Bootstrap o Tailwind obligatorio: si (Bootstrap)
- Estructura por capas (pages, services, store, routes, etc): si
- Despliegue en hosting estatico: preparado para GitHub Pages (workflow incluido)
- PWA: no (opcional)

## Guia de instalacion

### 1) Clonar repositorio
```bash
git clone https://github.com/JavierGM19/Proyecto_2ev.git
cd Proyecto_2ev
```

### 2) Instalar frontend
```bash
npm install
```

### 3) Instalar API local
```bash
cd src/roles-api
npm install
cd ../..
```

### 4) Arrancar API local (terminal 1)
```bash
cd src/roles-api
npm run start
```

### 5) Arrancar frontend (terminal 2)
```bash
npm run dev
```

Frontend: `http://localhost:5173`  
API local: `http://localhost:4000`

### 6) Variable de entorno opcional
Si quieres cambiar la URL de la API de roles, crea `.env` en la raiz:
```env
VITE_ROLES_API_URL=http://localhost:4000
```

## Licencia
Licencia MIT.  
Ver archivo [LICENSE](./LICENSE).
