import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const shopTabs = [
  { label: "Novedades", key: "tag", value: "new" },
  { label: "Hombre", key: "category", value: "men" },
  { label: "Mujer", key: "category", value: "women" },
  { label: "Accesorios", key: "category", value: "accessories" },
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
      <path
        d="M6.5 8.5h11l-1 13h-9l-1-13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 8.5a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isLogged = useAuthStore((s) => s.isLogged);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);

  const q = searchParams.get("q") || "";

  const onSearchChange = (value) => {
    const sp = new URLSearchParams(searchParams);
    if (!value) sp.delete("q");
    else sp.set("q", value);
    navigate({ pathname: "/", search: sp.toString() }, { replace: true });
  };

  const handleShopTab = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (key === "tag") {
      next.delete("category");
    } else {
      next.delete("tag");
    }

    const current = next.get(key);
    if (current === value) next.delete(key);
    else next.set(key, value);

    navigate({ pathname: "/", search: next.toString() }, { replace: true });
  };

  const isShopTabActive = (key, value) => searchParams.get(key) === value;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900">
          react-ecomers
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <NavLink to="/" className="text-sm font-medium text-gray-700 transition hover:text-gray-900">
            Inicio
          </NavLink>
          <NavLink to="/login" className="text-sm font-medium text-gray-700 transition hover:text-gray-900">
            Login
          </NavLink>
          {isLogged && role === "admin" && (
            <NavLink to="/admin" className="text-sm font-medium text-gray-700 transition hover:text-gray-900">
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 md:flex">
          <IconSearch className="h-4 w-4 text-gray-500" />
          <input
            value={q}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar productos..."
            className="w-48 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => navigate("/")}
          >
            <IconSearch className="h-4 w-4" /> Buscar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => navigate("/")}
          >
            <IconBag className="h-4 w-4" /> Carrito
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => {
              if (isLogged) {
                logout();
                navigate("/", { replace: true });
                return;
              }
              navigate("/login");
            }}
          >
            <IconUser className="h-4 w-4" /> {isLogged ? "Salir" : "Cuenta"}
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50/70">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5">
          {shopTabs.map((tab) => {
            const active = isShopTabActive(tab.key, tab.value);
            return (
              <button
                key={`${tab.key}:${tab.value}`}
                type="button"
                onClick={() => handleShopTab(tab.key, tab.value)}
                className={[
                  "whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition",
                  active
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
