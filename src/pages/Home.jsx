import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../services/fakeStoreApi";
import FilterChips from "../components/FilterChips";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const activeCategory = searchParams.get("category");

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const filtered = useMemo(() => {
    if (!data) return [];

    let list = data;

    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (activeCategory) {
      list = list.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        if (activeCategory === "men") return cat.includes("men");
        if (activeCategory === "women") return cat.includes("women");
        if (activeCategory === "accessories") return cat.includes("jewel");
        return true;
      });
    }

    return list;
  }, [data, q, activeCategory]);

  if (isLoading) return <p className="text-gray-600">Cargando productos...</p>;
  if (error) return <p className="text-red-600">Error cargando productos</p>;

  return (
    <section className="space-y-7">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Home · Catálogo</p>
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">New Arrivals</h1>
        <p className="max-w-2xl text-sm text-gray-600">
          Explora una selección de productos inspirada en el estilo minimal, con layout limpio y navegación por
          filtros rápidos.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips />

        <div className="w-full lg:w-80">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar productos
          </label>
          <input>
            id="catalog-search"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400"
            placeholder="Buscar por nombre..."
            defaultValue={searchParams.get("q") || ""}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              const value = e.target.value.trim();

              if (!value) next.delete("q");
              else next.set("q", value);

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
      </div>

main
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <p className="text-sm text-gray-500">
          Mostrando <span className="font-semibold text-gray-900">{filtered.length}</span> productos
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
