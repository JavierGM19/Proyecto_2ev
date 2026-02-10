import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Admin from "../pages/Admin";
import ProtectedRoute from "../routes/ProtectedRoute";
import ProductosDetail from "../pages/ProductosDetail";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/product/:id", element: <ProductosDetail /> },

      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [{ path: "/admin", element: <Admin /> }],
      },
    ],
  },
]);
