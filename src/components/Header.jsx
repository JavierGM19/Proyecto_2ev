import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const navItems = [
    { label: "New Arrivals", to: "/?tag=new" },
    { label: "Men", to: "/?category=men" },
    { label: "Women", to: "/?category=women" },
    { label: "Accessories", to: "/?category=accessories" },
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

function IconBag(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M6.5 8.5h11l-1 13h-9l-1-13Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path
                d="M9 8.5a3 3 0 0 1 6 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function IconUser(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M4.5 21a7.5 7.5 0 0 1 15 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
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

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const onSearchChange = (value) => {
        const sp = new URLSearchParams(searchParams);
        if (!value) sp.delete("q");
        else sp.set("q", value);
        navigate({ pathname: "/", search: sp.toString() }, { replace: true });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                {/* Left: Brand */}
                <Link to="/" className="flex items-center gap-2 font-semibold tracking-wide">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-white text-xs">
                        M
                    </span>
                    <span>MINIMAL</span>
                </Link>

                {/* Center: Nav */}
                <nav className="hidden items-center gap-6 md:flex">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `text-sm font-medium transition ${isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Right: Search + Icons */}
                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-md border bg-white px-3 py-2 md:flex">
                        <IconSearch className="h-4 w-4 text-gray-500" />
                        <input
                            value={q}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search"
                            className="w-48 bg-transparent text-sm outline-none placeholder:text-gray-400"
                        />
                    </div>

                    <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
                        aria-label="Search"
                        onClick={() => navigate("/?focusSearch=1")}
                    >
                        <IconSearch className="h-5 w-5 text-gray-700 md:hidden" />
                    </button>

                    <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
                        aria-label="Cart"
                        onClick={() => navigate("/cart")}
                        title="Cart (lo haremos luego)"
                    >
                        <IconBag className="h-5 w-5 text-gray-700" />
                    </button>

                    {isLogged ? (
                        <div className="flex items-center gap-2">
                            {role === "admin" && (
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin")}
                                    className="hidden rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50 md:inline-flex"
                                >
                                    Admin
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="hidden rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50 md:inline-flex"
                            >
                                Logout
                            </button>

                            <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
                                aria-label="Account"
                                onClick={() => navigate("/login")}
                                title="Account"
                            >
                                <IconUser className="h-5 w-5 text-gray-700" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
                            aria-label="Login"
                            onClick={() => navigate("/login")}
                            title="Login"
                        >
                            <IconUser className="h-5 w-5 text-gray-700" />
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile nav */}
            <div className="border-t bg-white md:hidden">
                <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className="whitespace-nowrap rounded-full border px-3 py-1.5 text-sm text-gray-700"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}
