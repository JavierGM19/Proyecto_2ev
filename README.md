# DAW Shop — Proyecto final React

## 1) Descripción del proyecto
**DAW Shop** es una aplicación web e-commerce desarrollada con **React + Vite**.
Incluye catálogo de productos, búsqueda, carrito, login y un panel de administración para gestionar roles y usuarios.

### Funcionalidades principales
- Navegación por rutas con React Router.
- Listado y detalle de productos consumiendo FakeStore API.
- Inicio de sesión con dos flujos:
  - **Admin maestro** (`mor_2314`) validado contra FakeStore API.
  - **Usuarios locales** validados en API propia (`roles-api`).
- Registro de usuarios en backend local (persistencia en JSON).
- Panel admin protegido por rol para:
  - editar roles en modo borrador + guardar cambios,
  - eliminar usuarios (excepto admin principal) con confirmación.
- Interfaz responsive con breakpoints explícitos: `990px`, `767px`, `510px`, `480px`.
- Uso de Bootstrap 5 en componentes de UI.

---

## 2) Framework y librerías (con versiones)

### Frontend
- **react**: `^19.2.0`
- **react-dom**: `^19.2.0`
- **react-router-dom**: `^7.13.0`
- **@tanstack/react-query**: `^5.90.20`
- **zustand**: `^5.0.11`
- **vite**: `^7.3.1`
- **tailwindcss**: `^4.1.18` (instalado en el proyecto)

### Backend local (`src/roles-api`)
- **express**: `^5.2.1`
- **cors**: `^2.8.6`
- **dotenv**: `^17.3.1`
- **jsonwebtoken**: `^9.0.3`
- **zod**: `^4.3.6`
- **nodemon** (dev): `^3.1.11`

> Nota: Bootstrap 5 se está cargando por CDN en `index.html`.

---

## 3) Requisitos del enunciado (estado actual)

- ✅ Uso de rutas en React.
- ✅ Consumo de API con GET y POST (también PATCH y DELETE).
- ✅ Diseño responsive con breakpoints solicitados (`990/767/510/480`).
- ✅ Login + apartado usuario/admin.
- ✅ Uso de Bootstrap.
- ✅ Estructura profesional por capas (`pages`, `components`, `services`, `store`, `routes`).
- ⚠️ Despliegue estático: pendiente de publicar URL final (GitHub Pages/Netlify/Vercel).
- ➖ PWA: opcional, no implementado.
- ➖ React Native Android: no implementado.

---

## 4) Estructura del proyecto

```text
Proyecto_2ev/
├─ src/
│  ├─ app/                 # router principal
│  ├─ components/          # componentes reutilizables
│  ├─ layouts/             # layouts públicos
│  ├─ pages/               # pantallas (Home, Login, Admin, Detail)
│  ├─ routes/              # protección de rutas por rol
│  ├─ services/            # consumo APIs (FakeStore y roles-api)
│  ├─ store/               # estado global (auth/cart) con zustand
│  └─ roles-api/           # API local (Express) para usuarios/roles
└─ README.md
```

---

## 5) Guía de instalación

### Requisitos previos
- Node.js 20 o superior
- npm 10 o superior

### 1. Clonar repositorio
```bash
git clone https://github.com/JavierGM19/Proyecto_2ev.git
cd Proyecto_2ev
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Instalar dependencias de la API local de roles
```bash
cd src/roles-api
npm install
cd ../..
```

### 4. Arrancar la API local (terminal 1)
```bash
cd src/roles-api
npm run start
```

La API quedará disponible en `http://localhost:4000`.

### 5. Arrancar frontend (terminal 2)
```bash
npm run dev
```

La web quedará disponible en `http://localhost:5173`.

### 6. Variables de entorno (opcional)
Puedes crear un archivo `.env` en la raíz para cambiar la URL de la API de roles:

```env
VITE_ROLES_API_URL=http://localhost:4000
```

---

## 6) Licencia

Este proyecto se distribuye bajo licencia **MIT**.
Consulta el fichero [LICENSE](./LICENSE) para el texto completo.
