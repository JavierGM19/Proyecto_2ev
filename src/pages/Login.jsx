import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/fakeStoreApi";
import { useAuthStore } from "../store/authStore";

const ROLES_API_URL = "http://localhost:4000/role";

export default function Login() {
    const navigate = useNavigate();

    // Auth store
    const setSession = useAuthStore((s) => s.setSession);
    const isLogged = useAuthStore((s) => s.isLogged);
    const roleStored = useAuthStore((s) => s.role);

    // Form state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Si ya hay sesión, fuera de /login
    useEffect(() => {
        if (!isLogged) return;

        if (roleStored === "admin") navigate("/admin", { replace: true });
        else navigate("/", { replace: true });
    }, [isLogged, roleStored, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const cleanUsername = username.trim();
            const data = await login(cleanUsername, password); // Login Fake Store API

            let role = "user";

            try {
                const roleResponse = await fetch(ROLES_API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: cleanUsername }),
                });

                if (roleResponse.ok) {
                    const roleData = await roleResponse.json();
                    role = roleData?.role || "user";
                }
            } catch {
                role = "user";
            }

            setSession({ token: data.token, role, username: cleanUsername });

            // Redirección según rol
            if (role === "admin") navigate("/admin", { replace: true });
            else navigate("/", { replace: true });
        } catch (err) {
            setError(err?.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-sm">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    className="border p-2"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />

                <input
                    className="border p-2"
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />

                <button className="border p-2" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>

                {error && <p className="text-red-600">{error}</p>}

                <p className="text-sm text-gray-600">
                    Prueba FakeStore (demo): <br />
                    username: <b>mor_2314</b> <br />
                    password: <b>83r5^_</b>
                </p>
            </form>
        </div>
    );
}
