import { useMemo } from "react";
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
  const filtersPanelOpen = searchParams.get("filters") === "open";

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

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value && value !== 0) next.delete(key);
    else next.set(key, String(value));
    setSearchParams(next, { replace: true });
  };

  const setCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    if (!category) next.delete("category");
    else next.set("category", category);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    next.delete("min");
    next.delete("max");
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const closeFiltersPanel = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("filters");
    setSearchParams(next, { replace: true });
  };

  if (isLoading) return <p className="text-gray-600">Cargando productos...</p>;
  if (error) return <p className="text-red-600">Error cargando productos</p>;

  return (
    <section className="space-y-6">
      {filtersPanelOpen && (
        <button
          type="button"
          aria-label="Cerrar panel de filtros"
          onClick={closeFiltersPanel}
          className="fixed inset-0 z-30 bg-black/20"
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 z-40 h-dvh w-[320px] border-r border-gray-200 bg-white p-5 shadow-xl transition-transform duration-300",
          filtersPanelOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col gap-6 overflow-y-auto pt-24">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">Buscar y filtrar</h2>
            <button
              type="button"
              onClick={closeFiltersPanel}
              className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cerrar
            </button>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Buscar</label>
            <input
              type="text"
              value={q}
              onChange={(e) => setParam("q", e.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none"
            />
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Categorías</h3>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => setCategory("")}
                className={[
                  "rounded-lg border px-3 py-2 text-left text-sm font-medium transition",
                  !activeCategory ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setCategory(activeCategory === category ? "" : category)}
                  className={[
                    "rounded-lg border px-3 py-2 text-left text-sm font-medium transition",
                    activeCategory === category
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {formatCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Rango de precio</h3>
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
            className="mt-auto w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Limpiar filtros
          </button>
        </div>
      </aside>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filtered.length}</span> products
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-3 2xl:grid-cols-2">
          {filtered.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} compact />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
