import { useEffect, useState } from "react";

const API_BASE = "http://localhost:4000";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function updateRole(username, role) {
    try {
      const res = await fetch(`${API_BASE}/users/${encodeURIComponent(username)}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar el rol");
      const updated = await res.json();

      setUsers((prev) => prev.map((user) => (user.username === updated.username ? updated : user)));
    } catch (err) {
      setError(err?.message || "Error");
    }
  }

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <section>
      <h1>Panel de administración</h1>
      {error && <p className="error">{error}</p>}

      <div className="admin-grid">
        {users.map((user) => (
          <article key={user.username} className="admin-card">
            <p><strong>{user.username}</strong></p>
            <p>Rol actual: {user.role}</p>

            <select value={user.role} onChange={(e) => updateRole(user.username, e.target.value)}>
              <option value="guest">Invitado</option>
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </article>
        ))}
      </div>
    </section>
  );
}
