import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "../services/fakeStoreApi";

function formatPrice(value) {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

export default function InfoApi() {
  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["api-info-products"],
    queryFn: getProducts,
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["api-info-categories"],
    queryFn: getCategories,
  });

  const metrics = useMemo(() => {
    if (!products.length) {
      return {
        total: 0,
        averagePrice: 0,
        maxPrice: null,
      };
    }

    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    const maxPriceProduct = products.reduce((max, product) => {
      if (!max || product.price > max.price) return product;
      return max;
    }, null);

    return {
      total: products.length,
      averagePrice: totalPrice / products.length,
      maxPrice: maxPriceProduct,
    };
  }, [products]);

  if (productsLoading || categoriesLoading) return <p>Cargando información de la API...</p>;
  if (productsError || categoriesError) return <p>No se pudo cargar la información de FakeStore.</p>;

  return (
    <section className="info-page">
      <div>
        <h1>Información de FakeStore API</h1>
        <p className="subtitle">Resumen dinámico usando endpoints públicos de la API.</p>
      </div>

      <div className="info-stats-grid">
        <article className="info-card">
          <h2>Total de productos</h2>
          <p className="info-main-value">{metrics.total}</p>
        </article>

        <article className="info-card">
          <h2>Categorías disponibles</h2>
          <p className="info-main-value">{categories.length}</p>
        </article>

        <article className="info-card">
          <h2>Precio medio</h2>
          <p className="info-main-value">{formatPrice(metrics.averagePrice)}</p>
        </article>
      </div>

      <article className="info-card">
        <h2>Categorías de la API</h2>
        <div className="info-category-list">
          {categories.map((category) => (
            <span className="info-badge" key={category}>
              {category}
            </span>
          ))}
        </div>
      </article>

      {metrics.maxPrice && (
        <article className="info-card">
          <h2>Producto con precio más alto</h2>
          <p>
            <strong>{metrics.maxPrice.title}</strong> · {formatPrice(metrics.maxPrice.price)}
          </p>
        </article>
      )}

      <article className="info-card">
        <h2>Muestra de productos</h2>
        <ul className="info-products-list">
          {products.slice(0, 6).map((product) => (
            <li key={product.id}>
              <span>{product.title}</span>
              <strong>{formatPrice(product.price)}</strong>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
