import { useEffect, useMemo, useState } from "react";
import { getRegisteredUsers, updateUserRole } from "../services/localAuth";

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
      const allUsers = await getRegisteredUsers();
      setUsers(allUsers);
      setPendingRoles({});
    } catch (err) {
      setError(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleRoleChange(username, selectedRole) {
    setOkMessage("");

    const user = users.find((item) => item.username === username);
    if (!user) return;

    setPendingRoles((prev) => {
      if (selectedRole === user.role) {
        const copy = { ...prev };
        delete copy[username];
        return copy;
      }

      return {
        ...prev,
        [username]: selectedRole,
      };
    });
  }

  async function handleSaveAll() {
    if (!changedCount) return;

    setSaving(true);
    setError("");
    setOkMessage("");

    try {
      const entries = Object.entries(pendingRoles);

      await Promise.all(
        entries.map(([username, role]) => updateUserRole(username, role))
      );

      setOkMessage("Roles guardados correctamente.");
      await loadUsers();
    } catch (err) {
      setError(err?.message || "No se pudieron guardar los cambios");
    } finally {
      setSaving(false);
    }
  }

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
        {users.map((user) => {
          const currentRole = pendingRoles[user.username] || user.role;
          const isMasterAdmin = user.username === MASTER_ADMIN_USERNAME;

          return (
            <article key={user.username} className="admin-card">
              <p>
                <strong>{user.username}</strong>
              </p>
              <p>Tipo de cuenta: {user.role}</p>

              <label className="admin-role-label">
                Nuevo rol
                <select
                  value={currentRole}
                  onChange={(e) => handleRoleChange(user.username, e.target.value)}
                  disabled={isMasterAdmin || saving}
                >
                  <option value="guest">Invitado</option>
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              {isMasterAdmin && (
                <p className="admin-note">Admin maestro (no editable)</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
