import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginFakeStore } from "../services/fakeStoreApi";
import { loginLocal, registerLocal } from "../services/localAuth";
import { fetchRoleByUsername } from "../services/rolesApi";
import { useAuthStore } from "../store/authStore";

const MASTER_ADMIN = {
  username: "mor_2314",
  password: "83r5^_",
};

export default function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const [username, setUsername] = useState(MASTER_ADMIN.username);
  const [password, setPassword] = useState(MASTER_ADMIN.password);
  const [error, setError] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState("user");
  const [registerLoading, setRegisterLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOkMessage("");
    setLoading(true);

    try {
      const cleanUsername = username.trim();
      let session = null;

      if (cleanUsername === MASTER_ADMIN.username) {
        const apiAuth = await loginFakeStore(cleanUsername, password);
        const apiRole = await fetchRoleByUsername(cleanUsername).catch(() => "admin");
        session = {
          token: apiAuth.token,
          username: cleanUsername,
          role: apiRole,
        };
      } else {
        session = loginLocal(cleanUsername, password);
      }

      setSession(session);

      if (session.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setOkMessage("");
    setRegisterLoading(true);

    try {
      registerLocal({
        username: registerUsername,
        password: registerPassword,
        role: registerRole,
      });

      setOkMessage("Usuario registrado correctamente. Ya puedes iniciar sesión.");
      setRegisterUsername("");
      setRegisterPassword("");
      setRegisterRole("user");
    } catch (err) {
      setError(err?.message || "No se pudo registrar el usuario");
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <section className="auth-box mx-auto">
      <h1>Iniciar sesión</h1>
      <p>
        Admin maestro (FakeStore API): <strong>{MASTER_ADMIN.username}</strong> /
        <strong> {MASTER_ADMIN.password}</strong>
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Usuario
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>
          Contraseña
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <p className="error">{error}</p>}
        {okMessage && <p className="ok-message">{okMessage}</p>}
      </form>

      <hr className="auth-divider" />

      <h2>Registro</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <label>
          Nuevo usuario
          <input
            className="form-control"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
        </label>

        <label>
          Contraseña
          <input
            className="form-control"
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
        </label>

        <label>
          Tipo de cuenta
          <select className="form-select" value={registerRole} onChange={(e) => setRegisterRole(e.target.value)}>
            <option value="user">Usuario</option>
            <option value="guest">Invitado</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button type="submit" disabled={registerLoading} className="btn btn-primary">
          {registerLoading ? "Guardando..." : "Registrar"}
        </button>
      </form>
    </section>
  );
}
