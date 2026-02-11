import { useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ExitLoginIcon, LoginIcon, NoLoginIcon } from "../img/loginIcons";

const navItems = [
  { label: "Shop", search: "" },
  { label: "New Arrivals", search: "?tag=new" },
  { label: "Sale", search: "?tag=sale" },
  { label: "About", to: "/login" },
];

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.2 16.2 21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconBag(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6.5 8.5h11l-1 13h-9l-1-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8.5a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoginIconHovered, setIsLoginIconHovered] = useState(false);

  const isLogged = useAuthStore((s) => s.isLogged);
  const logout = useAuthStore((s) => s.logout);

  const q = searchParams.get("q") || "";

  const loginButtonLabel = isLogged ? "Cerrar sesión" : "Ir a login";
  const loginButtonAlt = isLogged
    ? isLoginIconHovered
      ? "Cerrar sesión"
      : "Usuario logeado"
    : "Usuario sin sesión";

  const LoginVisualIcon = !isLogged
    ? NoLoginIcon
    : isLoginIconHovered
      ? ExitLoginIcon
      : LoginIcon;

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

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 md:h-18 md:px-6">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          react-ecomers
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => goToNav(item)}
              className="text-sm font-medium text-gray-700 transition hover:text-gray-950"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 lg:flex">
          <IconSearch className="h-4 w-4 text-gray-500" />
          <input
            value={q}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search collections..."
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button
            type="button"
            aria-label={loginButtonLabel}
            title={loginButtonLabel}
            onMouseEnter={() => setIsLoginIconHovered(true)}
            onMouseLeave={() => setIsLoginIconHovered(false)}
            onClick={() => {
              if (isLogged) {
                logout();
                navigate("/", { replace: true });
                return;
              }
              navigate("/login");
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
          >
            <span role="img" aria-label={loginButtonAlt} className="inline-flex items-center justify-center"><LoginVisualIcon className="h-7 w-7" /></span>
          </button>
          <button
            type="button"
            aria-label="Carrito"
            title="Carrito"
            onClick={() => navigate("/")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
          >
            <IconBag className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Menú"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <IconMenu className="h-5 w-5" />
          </button>
        </div>
      </div>

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
                type="button"
                onClick={() => goToNav(item)}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {item.label}
              </button>
            ))}
            <NavLink
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Login
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
