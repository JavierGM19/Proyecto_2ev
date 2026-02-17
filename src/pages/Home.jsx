import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/fakeStoreApi";
import { isApiTermTranslated, translateApiTerm } from "../i18n/apiDictionary";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryText = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "all";

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const categories = useMemo(() => {
    const allCategories = data.map((item) => item.category).filter(Boolean);
    return ["all", ...new Set(allCategories)];
  }, [data]);

  const filteredProducts = useMemo(() => {
    return data.filter((product) => {
      const sameCategory = category === "all" || product.category === category;
      const sameText = product.title.toLowerCase().includes(queryText);
      return sameCategory && sameText;
    });
  }, [data, category, queryText]);

  const untranslatedTerms = useMemo(() => {
    return categories.filter((term) => term !== "all" && !isApiTermTranslated(term));
  }, [categories]);

  function handleCategoryChange(nextCategory) {
    const next = new URLSearchParams(searchParams);

    if (nextCategory === "all") next.delete("category");
    else next.set("category", nextCategory);

    setSearchParams(next);
  }

  if (isLoading) return <p>Cargando productos...</p>;
  if (error) return <p>No se pudieron cargar los productos.</p>;

  return (
    <section>
      <h1>Tienda online</h1>
      <p className="subtitle">Ropa y productos usando FakeStore API.</p>

      <div className="category-list">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={cat === category ? "active" : ""}
          >
            {translateApiTerm(cat)}
          </button>
        ))}
      </div>

      {untranslatedTerms.length > 0 && (
        <p className="error">
          Faltan traducciones en diccionario para: {untranslatedTerms.join(", ")}
        </p>
      )}

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
