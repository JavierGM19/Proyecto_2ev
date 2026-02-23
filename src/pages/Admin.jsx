import { useEffect, useState } from "react";
import { getRegisteredUsers } from "../services/localAuth";
import { fetchUsers, ROLES_API_BASE_URL, updateUserRole } from "../services/rolesApi";

const MASTER_ADMIN_USERNAME = "mor_2314";
const ALLOWED_ROLES = ["guest", "user", "admin"];

function buildLocalFallbackUsers() {
  return [{ username: MASTER_ADMIN_USERNAME, role: "admin" }, ...getRegisteredUsers()];
}

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingUser, setSavingUser] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setError("");
    setOkMessage("");

    try {
      const apiUsers = await fetchUsers();
      setUsers(apiUsers);
      setUsingLocalFallback(false);
    } catch (err) {
      setUsers(buildLocalFallbackUsers());
      setUsingLocalFallback(true);
      setError(err?.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(username, role) {
    setError("");
    setOkMessage("");
    setSavingUser(username);

    try {
      const updatedUser = await updateUserRole(username, role);
      setUsers((prev) =>
        prev.map((u) => (u.username === username ? { ...u, role: updatedUser.role } : u))
      );
      setOkMessage(`Rol actualizado para ${username}`);
    } catch (err) {
      setError(err?.message || "No se pudo actualizar el rol");
    } finally {
      setSavingUser("");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <section className="container-fluid px-0">
      <h1 className="mb-3">Panel de administración</h1>
      {error && (
        <>
          <p className="error alert alert-danger">{error}</p>
          <button type="button" className="btn btn-primary" onClick={loadUsers}>
            Reintentar
          </button>
        </>
      )}
      {usingLocalFallback && (
        <p>
          Mostrando usuarios locales de respaldo. API esperada en: <strong>{ROLES_API_BASE_URL}</strong>
        </p>
      )}
      {okMessage && <p className="ok-message alert alert-success">{okMessage}</p>}

      <div className="admin-grid row g-3">
        {users.map((user) => (
          <article key={user.username} className="admin-card col-12 col-md-6 col-lg-4">
            <p>
              <strong>{user.username}</strong>
            </p>
            <label>
              Tipo de cuenta
              <select className="form-select"
                value={user.role}
                disabled={
                  usingLocalFallback ||
                  user.username === MASTER_ADMIN_USERNAME ||
                  savingUser === user.username
                }
                onChange={(e) => handleRoleChange(user.username, e.target.value)}
              >
                {ALLOWED_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            {user.username === MASTER_ADMIN_USERNAME && (
              <small>La cuenta admin principal no se puede modificar.</small>
            )}
            {usingLocalFallback && user.username !== MASTER_ADMIN_USERNAME && (
              <small>Conecta la API para guardar cambios de rol.</small>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
