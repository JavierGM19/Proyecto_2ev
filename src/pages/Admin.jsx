import { useEffect, useState } from "react";
import { fetchUsers, updateUserRole } from "../services/rolesApi";

const MASTER_ADMIN_USERNAME = "mor_2314";
const ALLOWED_ROLES = ["guest", "user", "admin"];

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingUser, setSavingUser] = useState("");
  const [okMessage, setOkMessage] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");
    setOkMessage("");

    try {
      const apiUsers = await fetchUsers();
      setUsers(apiUsers);
    } catch (err) {
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
    <section>
      <h1>Panel de administración</h1>
      {error && (
        <>
          <p className="error">{error}</p>
          <button type="button" className="btn-primary" onClick={loadUsers}>
            Reintentar
          </button>
        </>
      )}
      {okMessage && <p className="ok-message">{okMessage}</p>}

      <div className="admin-grid">
        {users.map((user) => (
          <article key={user.username} className="admin-card">
            <p>
              <strong>{user.username}</strong>
            </p>
            <label>
              Tipo de cuenta
              <select
                value={user.role}
                disabled={user.username === MASTER_ADMIN_USERNAME || savingUser === user.username}
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
          </article>
        ))}
      </div>
    </section>
  );
}
