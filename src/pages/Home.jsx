import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/fakeStoreApi";
import ProductCard from "../components/ProductCard";

export default function Home() {
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
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Catálogo principal</h1>
        <p className="max-w-2xl text-sm text-gray-600">
          Usa las pestañas superiores para cambiar entre secciones y filtrar productos por categoría.
        </p>
      </div>

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
