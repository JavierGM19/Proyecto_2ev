import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

const API_BASE = "http://localhost:4000";

const ROLE_LABEL = {
    guest: "Invitado",
    user: "Usuario",
    admin: "Admin",
};

export default function Admin() {
    const { username: currentUsername, role: currentRole } = useAuthStore();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingUser, setSavingUser] = useState(null);
    const [error, setError] = useState("");

    async function loadUsers() {
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users`);
            if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.message || "Error cargando usuarios");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function updateRole(username, role) {
        setError("");
        setSavingUser(username);
        try {
            const res = await fetch(`${API_BASE}/users/${encodeURIComponent(username)}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });

            if (!res.ok) {
                const msg = await res.json().catch(() => null);
                throw new Error(msg?.message || "No se pudo actualizar el rol");
            }

            const updated = await res.json();
            setUsers((prev) =>
                prev.map((u) => (u.username === updated.username ? updated : u))
            );
        } catch (e) {
            setError(e?.message || "Error actualizando rol");
        } finally {
            setSavingUser(null);
        }
    }

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold mb-4">Panel Admin</h1>

            {/* Tarjeta del usuario actual */}
            <div className="border p-4 mb-6">
                <h2 className="font-semibold">Sesión actual</h2>
                <p className="mt-1">
                    Usuario: <b>{currentUsername || "Sin login"}</b>
                </p>
                <p className="mt-1">
                    Rol:{" "}
                    <b>
                        {currentRole ? ROLE_LABEL[currentRole] || currentRole : "Sin rol (invitado)"}
                    </b>
                </p>
            </div>

            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Usuarios</h2>
                <button className="border px-3 py-1" onClick={loadUsers} disabled={loading}>
                    Recargar
                </button>
            </div>

            {loading && <p>Cargando usuarios...</p>}
            {error && <p className="text-red-600 mb-3">{error}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
                {users.map((u) => (
                    <div key={u.username} className="border p-4">
                        <p className="font-semibold">{u.username}</p>
                        <p className="text-sm mt-1">
                            Rol actual: <b>{ROLE_LABEL[u.role] || u.role}</b>
                        </p>

                        <label className="block text-sm mt-3">Cambiar rol</label>
                        <select
                            className="border p-2 mt-1 w-full"
                            value={u.role}
                            onChange={(e) => updateRole(u.username, e.target.value)}
                            disabled={savingUser === u.username}
                        >
                            <option value="guest">Invitado</option>
                            <option value="user">Usuario</option>
                            <option value="admin">Admin</option>
                        </select>

                        {savingUser === u.username && (
                            <p className="text-sm mt-2">Guardando...</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
