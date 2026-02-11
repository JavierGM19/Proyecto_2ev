import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/fakeStoreApi";

function formatCategoryLabel(category) {
  return category
    .split(" ")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const activeCategory = searchParams.get("category") || "";
  const activeTag = searchParams.get("tag") || "";
  const minPrice = Number(searchParams.get("min") || 0);
  const maxPrice = Number(searchParams.get("max") || 1000);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const categories = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((product) => product.category).filter(Boolean))];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];

    let list = [...data];

    if (q) {
      list = list.filter((product) => product.title.toLowerCase().includes(q));
    }

    if (activeCategory) {
      list = list.filter((product) => product.category === activeCategory);
    }

    list = list.filter((product) => product.price >= minPrice && product.price <= maxPrice);

    if (activeTag === "new") {
      list = [...list].sort((a, b) => b.id - a.id).slice(0, 8);
    }

    if (activeTag === "sale") {
      list = list.filter((product) => product.price <= 50);
    }

    return list;
  }, [activeCategory, activeTag, data, maxPrice, minPrice, q]);

  const heroProduct = filtered[0] || data?.[0];

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value && value !== 0) next.delete(key);
    else next.set(key, String(value));

    setSearchParams(next, { replace: true });
  };

  const toggleCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    if (activeCategory === category) next.delete("category");
    else next.set("category", category);

    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    next.delete("min");
    next.delete("max");
    setSearchParams(next, { replace: true });
  };

  if (isLoading) return <p className="text-gray-600">Cargando productos...</p>;
  if (error) return <p className="text-red-600">Error cargando productos</p>;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-9">
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">New Collection</p>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">New Arrivals</h1>
            <p className="max-w-xl text-base text-gray-600">
              Explore our curated selection of high-quality essentials designed to elevate your daily rotation.
            </p>
          </div>

          <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-6">
            {heroProduct ? (
              <img src={heroProduct.image} alt={heroProduct.title} className="h-56 w-full object-contain md:h-72" />
            ) : (
              <div className="h-56 w-full rounded-xl bg-gray-100" />
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-left text-sm font-medium text-gray-800"
        >
          {mobileFiltersOpen ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className={["space-y-6 rounded-2xl border border-gray-200 bg-white p-5", !mobileFiltersOpen ? "hidden lg:block" : "block"].join(" ")}>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Categories</h2>
            <div className="mt-4 space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={activeCategory === category}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span>{formatCategoryLabel(category)}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Price Range</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between gap-2 text-xs text-gray-500">
                Min
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setParam("min", Math.max(0, Number(e.target.value || 0)))}
                  className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-700"
                />
              </label>

              <label className="flex items-center justify-between gap-2 text-xs text-gray-500">
                Max
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setParam("max", Math.max(0, Number(e.target.value || 0)))}
                  className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-700"
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Limpiar filtros
          </button>
        </aside>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> products
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
