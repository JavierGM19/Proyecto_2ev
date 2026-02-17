import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/fakeStoreApi";
import { useAuthStore } from "../store/authStore";

const ROLES_API_URL = "http://localhost:4000/role";

export default function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const [username, setUsername] = useState("mor_2314");
  const [password, setPassword] = useState("83r5^_");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanUsername = username.trim();
      const auth = await login(cleanUsername, password);

      const roleResponse = await fetch(ROLES_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUsername }),
      });

      const roleData = roleResponse.ok ? await roleResponse.json() : { role: "user" };

      setSession({
        token: auth.token,
        username: cleanUsername,
        role: roleData.role || "user",
      });

      navigate("/");
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-box">
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Usuario
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}
