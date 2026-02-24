import { useEffect, useMemo, useState } from "react";
import { getRegisteredUsers } from "../services/localAuth";
import { deleteUser, fetchUsers, ROLES_API_BASE_URL, updateUserRole } from "../services/rolesApi";

const MASTER_ADMIN_USERNAME = "mor_2314";
const ALLOWED_ROLES = ["guest", "user", "admin"];

function buildLocalFallbackUsers() {
  return [{ username: MASTER_ADMIN_USERNAME, role: "admin" }, ...getRegisteredUsers()];
}

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);
  const [pendingRoles, setPendingRoles] = useState({});
  const [savingChanges, setSavingChanges] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);

  const pendingCount = useMemo(() => Object.keys(pendingRoles).length, [pendingRoles]);

  async function loadUsers() {
    setLoading(true);
    setError("");
    setOkMessage("");
    setPendingRoles({});

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

  function handleRoleDraft(username, role) {
    setError("");
    setOkMessage("");

    setPendingRoles((prev) => {
      const currentUser = users.find((u) => u.username === username);
      if (!currentUser) return prev;

      const next = { ...prev };
      if (role === currentUser.role) {
        delete next[username];
      } else {
        next[username] = role;
      }
      return next;
    });
  }

  async function handleSaveChanges() {
    if (pendingCount === 0 || usingLocalFallback) return;

    setSavingChanges(true);
    setError("");
    setOkMessage("");

    try {
      const pendingEntries = Object.entries(pendingRoles);

      for (const [username, role] of pendingEntries) {
        await updateUserRole(username, role);
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.username in pendingRoles
            ? { ...user, role: pendingRoles[user.username] }
            : user
        )
      );
      setPendingRoles({});
      setOkMessage("Cambios guardados correctamente en users.json");
    } catch (err) {
      setError(err?.message || "No se pudieron guardar los cambios");
    } finally {
      setSavingChanges(false);
    }
  }


  function askDeleteUser(username) {
    setError("");
    setOkMessage("");
    setDeleteCandidate(username);
  }

  function closeDeleteModal() {
    if (deletingUser) return;
    setDeleteCandidate(null);
  }

  async function confirmDeleteUser() {
    if (!deleteCandidate || usingLocalFallback) return;

    setDeletingUser(true);
    setError("");
    setOkMessage("");

    try {
      await deleteUser(deleteCandidate);
      setUsers((prev) => prev.filter((user) => user.username !== deleteCandidate));
      setPendingRoles((prev) => {
        if (!(deleteCandidate in prev)) return prev;
        const next = { ...prev };
        delete next[deleteCandidate];
        return next;
      });
      setOkMessage(`Usuario ${deleteCandidate} eliminado correctamente`);
      setDeleteCandidate(null);
    } catch (err) {
      setError(err?.message || "No se pudo eliminar el usuario");
    } finally {
      setDeletingUser(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <section className="container-fluid px-0">
      <h1 className="mb-3">Panel de administración</h1>

      <button
        type="button"
        className={`btn save-roles-btn ${pendingCount > 0 ? "save-roles-btn--pending" : ""}`}
        onClick={handleSaveChanges}
        disabled={pendingCount === 0 || savingChanges || usingLocalFallback}
      >
        {savingChanges ? "Guardando..." : "Guardar cambios"}
      </button>

      {error && (
        <>
          <p className="error alert alert-danger mt-3">{error}</p>
          <button type="button" className="btn btn-primary" onClick={loadUsers}>
            Reintentar
          </button>
        </>
      )}
      {usingLocalFallback && (
        <p className="mt-3">
          Mostrando usuarios locales de respaldo. API esperada en: <strong>{ROLES_API_BASE_URL}</strong>
        </p>
      )}
      {okMessage && <p className="ok-message alert alert-success mt-3">{okMessage}</p>}

      <div className="row g-3 mt-1">
        {users.map((user) => {
          const shownRole = pendingRoles[user.username] || user.role;

          return (
            <article key={user.username} className="admin-card col-12 col-md-6 col-lg-4 h-100">
              <p>
                <strong>{user.username}</strong>
              </p>
              <label>
                Tipo de cuenta
                <select
                  className="form-select"
                  value={shownRole}
                  disabled={
                    usingLocalFallback ||
                    savingChanges ||
                    deletingUser ||
                    user.username === MASTER_ADMIN_USERNAME
                  }
                  onChange={(e) => handleRoleDraft(user.username, e.target.value)}
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
                <small>Conecta la API para guardar cambios de rol o eliminar usuarios.</small>
              )}
              {user.username !== MASTER_ADMIN_USERNAME && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm mt-3"
                  disabled={usingLocalFallback || savingChanges || deletingUser}
                  onClick={() => askDeleteUser(user.username)}
                >
                  Borrar
                </button>
              )}
            </article>
          );
        })}
      </div>

      {deleteCandidate && (
        <div className="confirm-modal-overlay" role="dialog" aria-modal="true">
          <div className="confirm-modal-card">
            <h2>Confirmar borrado</h2>
            <p>¿Quieres borrar al usuario <strong>{deleteCandidate}</strong>?</p>
            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDeleteUser}
                disabled={deletingUser}
              >
                {deletingUser ? "Borrando..." : "SI"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
                disabled={deletingUser}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
