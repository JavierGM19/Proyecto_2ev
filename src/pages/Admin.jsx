import { useEffect, useState } from "react";
import { getRegisteredUsers } from "../services/localAuth";

const MASTER_ADMIN_USERNAME = "mor_2314";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const [pendingRoles, setPendingRoles] = useState({});

  const changedCount = useMemo(
    () => Object.keys(pendingRoles).length,
    [pendingRoles]
  );

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const localUsers = getRegisteredUsers();
      const allUsers = [
        { username: MASTER_ADMIN_USERNAME, role: "admin" },
        ...localUsers,
      ];
      setUsers(allUsers);
    } catch (err) {
      setError(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <section>
      <div className="admin-header">
        <h1>Panel de administración</h1>
        <button
          type="button"
          className="btn-primary"
          disabled={!changedCount || saving}
          onClick={handleSaveAll}
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {!!changedCount && <p>Cambios pendientes: {changedCount}</p>}
      {error && <p className="error">{error}</p>}
      {okMessage && <p className="ok-message">{okMessage}</p>}

      <div className="admin-grid">
        {users.map((user) => (
          <article key={user.username} className="admin-card">
            <p><strong>{user.username}</strong></p>
            <p>Tipo de cuenta: {user.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
