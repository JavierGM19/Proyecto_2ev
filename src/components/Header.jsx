import { useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import CartModal from "./CartModal";

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isLogged = useAuthStore((s) => s.isLogged);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);

  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [cartOpen, setCartOpen] = useState(false);
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");

  function handleSearchSubmit(e) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);

    if (searchText.trim()) next.set("q", searchText.trim());
    else next.delete("q");

    navigate({ pathname: "/", search: next.toString() });
  }

  function handleLoginButton() {
    if (isLogged) {
      logout();
      navigate("/");
      return;
    }

    navigate("/login");
  }

  return (
    <>
      <header className="header">
        <div className="container header-row">
          <Link to="/" className="brand">
            DAW Shop
          </Link>

          <nav className="menu nav">
            <NavLink className="nav-link px-2" to="/">Inicio</NavLink>
            {role === "admin" && <NavLink className="nav-link px-2" to="/admin">Admin</NavLink>}
          </nav>

          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              className="form-control"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar producto"
            />
            <button type="submit" className="btn btn-outline-secondary">Buscar</button>
          </form>

          <div className="header-actions">
            <button type="button" className="btn btn-outline-dark" onClick={() => setCartOpen(true)}>
              🛒 <span>{cartCount}</span>
            </button>
            <button type="button" className="btn btn-primary" onClick={handleLoginButton}>
              {isLogged ? "Salir" : "Entrar"}
            </button>
          </div>
        </div>
      </header>

      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
