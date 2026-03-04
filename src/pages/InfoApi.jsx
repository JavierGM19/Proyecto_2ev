import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "../services/fakeStoreApi";
import { fetchUsers, ROLES_API_BASE_URL } from "../services/rolesApi";

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

  const {
    data: localUsers = [],
    isLoading: localUsersLoading,
    error: localUsersError,
  } = useQuery({
    queryKey: ["api-info-local-users"],
    queryFn: fetchUsers,
    retry: 1,
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

  const localRoles = useMemo(() => {
    const roles = localUsers.map((user) => user.role).filter(Boolean);
    return [...new Set(roles)];
  }, [localUsers]);

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

      <div>
        <h1>Informacion de API local</h1>
        <p className="subtitle">Resumen de funciones para gestionar usuarios y roles.</p>
      </div>

      <article className="info-card">
        <h2>API local de usuarios y roles</h2>
        <p>
          Esta API se usa para gestionar usuarios de la aplicacion y sus permisos por rol.
          Permite registrar cuentas, iniciar sesion local, consultar roles y administrar usuarios.
        </p>
        <p>
          URL base esperada: <code>{ROLES_API_BASE_URL}</code>
        </p>

        {localUsersLoading && <p>Comprobando conexion con la API local...</p>}
        {localUsersError && (
          <p className="error">
            No se pudo conectar con la API local ahora mismo. Aun asi, estas son sus funciones.
          </p>
        )}
        {!localUsersLoading && !localUsersError && (
          <p>
            Usuarios detectados: <strong>{localUsers.length}</strong>
            {localRoles.length > 0 ? ` · Roles actuales: ${localRoles.join(", ")}` : ""}
          </p>
        )}

        <h3>Funciones que tiene</h3>
        <ul className="info-functions-list">
          <li><code>GET /</code>: comprobar si la API esta funcionando.</li>
          <li><code>POST /role</code>: obtener el rol de un usuario por su username.</li>
          <li><code>GET /users</code>: listar usuarios (sin exponer password).</li>
          <li><code>POST /login-local</code>: login de usuarios locales (no admin maestro).</li>
          <li><code>POST /register</code>: registrar un usuario nuevo con rol.</li>
          <li><code>PATCH /users/:username/role</code>: actualizar rol de un usuario.</li>
          <li><code>DELETE /users/:username</code>: eliminar usuario.</li>
        </ul>
      </article>
    </section>
  );
}
