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

    // Search
    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Category filter (mapeo simple sobre categorías de FakeStore)
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

  const handleSearchChange = (value) => {
    const next = new URLSearchParams(searchParams);
    const v = value.trim();

    if (!v) next.delete("q");
    else next.set("q", v);

    navigate({ pathname: "/", search: next.toString() }, { replace: true });
  };

  if (isLoading) return <p className="text-gray-600">Cargando productos...</p>;
  if (error) return <p className="text-red-600">Error cargando productos</p>;

  return (
    <section className="space-y-7">
      {/* Hero / Intro */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
          Home · Catálogo
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          New Arrivals
        </h1>

        <p className="max-w-2xl text-sm text-gray-600">
          Explora una selección de productos inspirada en el estilo minimal, con layout limpio y navegación por
          filtros rápidos.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips />

        <div className="w-full lg:w-80">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar productos
          </label>

          <input
            id="catalog-search"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400"
            placeholder="Buscar por nombre..."
            defaultValue={searchParams.get("q") || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <p className="text-sm text-gray-500">
          Mostrando <span className="font-semibold text-gray-900">{filtered.length}</span> productos
        </p>
      </div>

      {/* Grid */}
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
