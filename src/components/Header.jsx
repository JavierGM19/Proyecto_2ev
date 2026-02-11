import { useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import CartModal from "./CartModal";

// Imágenes (en src/img)
import loginPng from "../img/login.png";
import noLoginPng from "../img/sin_login.png";
import exitLoginPng from "../img/exit_login.png";
import carritoPng from "../img/carrito.png";

const navItems = [
  { label: "Shop", search: "" },
  { label: "New Arrivals", search: "?tag=new" },
  { label: "Sale", search: "?tag=sale" },
  { label: "About", to: "/login" },
];

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M16.2 16.2 21 21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [hoverLogin, setHoverLogin] = useState(false);

  const isLogged = useAuthStore((s) => s.isLogged);
  const logout = useAuthStore((s) => s.logout);

  const items = useCartStore((s) => s.items);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const q = searchParams.get("q") || "";

  const loginImage = !isLogged
    ? noLoginPng
    : hoverLogin
      ? exitLoginPng
      : loginPng;

  const loginLabel = isLogged
    ? hoverLogin
      ? "Cerrar sesión"
      : "Mi cuenta"
    : "Login";

  const updateSearch = (value) => {
    const sp = new URLSearchParams(searchParams);
    if (!value.trim()) sp.delete("q");
    else sp.set("q", value.trim());
    navigate({ pathname: "/", search: sp.toString() }, { replace: true });
  };

  const goToNav = (item) => {
    if (item.to) {
      navigate(item.to);
      setMobileOpen(false);
      return;
    }
    navigate({ pathname: "/", search: item.search?.replace("?", "") || "" });
    setMobileOpen(false);
  };

  const handleLoginClick = () => {
    if (isLogged) {
      logout();
      navigate("/", { replace: true });
      return;
    }
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 md:px-6">

          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
            MINIMA
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => goToNav(item)}
                className="text-sm font-medium text-gray-700 hover:text-gray-950"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search */}
          <div className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 lg:flex">
            <IconSearch className="h-4 w-4 text-gray-500" />
            <input
              value={q}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Search collections..."
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-2 md:ml-0">

            {/* Login */}
            <button
              type="button"
              onMouseEnter={() => setHoverLogin(true)}
              onMouseLeave={() => setHoverLogin(false)}
              onClick={handleLoginClick}
              className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-gray-100"
            >
              <img
                src={loginImage}
                alt="login"
                className="h-7 w-7 object-contain"
                draggable="false"
              />
              <span className="hidden text-xs font-medium sm:inline">
                {loginLabel}
              </span>
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative rounded-md p-2 hover:bg-gray-100"
            >
              <img
                src={carritoPng}
                alt="carrito"
                className="h-7 w-7 object-contain"
                draggable="false"
              />

              {totalCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] font-semibold text-white">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden rounded-md p-2 hover:bg-gray-100"
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
              <IconSearch className="h-4 w-4 text-gray-500" />
              <input
                value={q}
                onChange={(e) => updateSearch(e.target.value)}
                placeholder="Search collections..."
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={`mobile-${item.label}`}
                  onClick={() => goToNav(item)}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {item.label}
                </button>
              ))}
              <NavLink
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Login
              </NavLink>
            </div>
          </div>
        )}
      </header>

      {/* Modal carrito */}
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
