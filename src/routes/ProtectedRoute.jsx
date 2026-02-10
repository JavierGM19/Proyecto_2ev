import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";


export default function ProtectedRoute({ allowedRoles }) {
  const { isLogged, role } = useAuthStore();

  if (!isLogged) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
