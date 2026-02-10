import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../services/fakeStoreApi";

const filterItems = [
    { key: "tag", value: "new", label: "New Arrivals" },
    { key: "category", value: "men", label: "Men" },
    { key: "category", value: "women", label: "Women" },
    { key: "category", value: "accessories", label: "Accessories" },
];

export default function Home() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const activeCategory = searchParams.get("category");
    const activeTag = searchParams.get("tag");

    const { data, isLoading, error } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });

    const toggleFilter = (key, value) => {
        const next = new URLSearchParams(searchParams);
        const current = next.get(key);

        if (current === value) next.delete(key);
        else next.set(key, value);

        navigate({ pathname: "/", search: next.toString() }, { replace: true });
    };

    const filtered = useMemo(() => {
        if (!data) return [];

        let list = data;

        // Buscar por título (y puedes ampliar a descripción si quieres)
        if (q) {
            list = list.filter((p) => p.title.toLowerCase().includes(q));
        }

        // Filtros UI (de momento solo para tu layout; luego lo conectamos a FakeStore real)
        // Si quieres que realmente filtre por categorías FakeStore, me lo dices y lo mapeamos.
        if (activeCategory) {
            list = list.filter((p) => {
                const cat = (p.category || "").toLowerCase();
                if (activeCategory === "men") return cat.includes("men");
                if (activeCategory === "women") return cat.includes("women");
                if (activeCategory === "accessories") return cat.includes("jewel");
                return true;
            });
        }

        if (activeTag) {
            // "new" es un tag visual sin datos reales en FakeStore.
            // Lo dejamos sin filtrar por ahora (solo marca el chip).
            // Si quieres, podemos simularlo con "primeros N productos".
        }

        return list;
    }, [data, q, activeCategory, activeTag]);

    if (isLoading) return <p className="text-gray-600">Cargando productos...</p>;
    if (error) return <p className="text-red-600">Error cargando productos</p>;

    return (
        <div className="space-y-6">
            {/* Encabezado de la página */}
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">Productos</h1>
                    <p className="text-sm text-gray-600">
                        Mostrando <span className="font-medium">{filtered.length}</span> productos
                    </p>
                </div>

                {/* Buscador (por si no quieres depender del header) */}
                <div className="w-full md:w-80">
                    <input
                        className="input"
                        placeholder="Search"
                        defaultValue={searchParams.get("q") || ""}
                        onChange={(e) => {
                            const next = new URLSearchParams(searchParams);
                            const value = e.target.value.trim();

                            if (!value) next.delete("q");
                            else next.set("q", value);

                            navigate({ pathname: "/", search: next.toString() }, { replace: true });
                        }}
                    />
                </div>
            </div>

            {/* Filtros tipo chips (toggle) */}
            <div className="flex flex-wrap gap-3">
                {filterItems.map((it) => {
                    const active = searchParams.get(it.key) === it.value;
                    return (
                        <button
                            key={`${it.key}:${it.value}`}
                            type="button"
                            onClick={() => toggleFilter(it.key, it.value)}
                            className={[
                                "btn rounded-full px-4 py-2 text-sm",
                                active
                                    ? "bg-gray-900 text-white"
                                    : "border border-gray-300 bg-white hover:bg-gray-50",
                            ].join(" ")}
                        >
                            {it.label}
                        </button>
                    );
                })}
            </div>

            {/* Grid de productos */}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product) => (
                    <li key={product.id} className="card p-4">
                        <div className="card-image mb-4 flex items-center justify-center">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="h-full w-full object-contain p-6"
                                loading="lazy"
                            />
                        </div>

                        <h2 className="text-sm font-semibold text-gray-900">
                            <Link to={`/product/${product.id}`} className="hover:underline">
                                {product.title}
                            </Link>
                        </h2>

                        <p className="mt-2 text-sm font-medium text-gray-900">
                            {product.price} €
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                            {product.category}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
