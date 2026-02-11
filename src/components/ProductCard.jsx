import { Link } from "react-router-dom";

export default function ProductCard({ product, compact = false }) {
  const wrapperClasses = compact
    ? "group h-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    : "group h-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md";

  const imageWrapperClasses = compact
    ? "flex h-[180px] w-[180px] shrink-0 items-center justify-center rounded-lg bg-gray-50 p-4 md:h-[220px] md:w-[220px] xl:h-[260px] xl:w-[260px]"
    : "mb-4 flex aspect-square items-center justify-center rounded-xl bg-gray-50 p-6";

  const titleClasses = compact
    ? "text-sm font-semibold leading-5 text-gray-900 md:text-base"
    : "mt-2 min-h-12 text-sm font-semibold text-gray-900";

  const categoryClasses = compact
    ? "text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400"
    : "text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400";

  const priceClasses = compact ? "mt-2 text-sm font-semibold text-gray-900 md:text-base" : "mt-3 text-base font-semibold text-gray-900";

  if (compact) {
    return (
      <article className={wrapperClasses}>
        <Link to={`/product/${product.id}`} className="flex h-full items-center gap-4">
          <div className={imageWrapperClasses}>
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain transition duration-200 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className={categoryClasses}>{product.category}</p>
            <h2 className={titleClasses}>{product.title}</h2>
            <p className={priceClasses}>{product.price} €</p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={wrapperClasses}>
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className={imageWrapperClasses}>
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain transition duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>

        <p className={categoryClasses}>{product.category}</p>
        <h2 className={titleClasses}>{product.title}</h2>
        <p className={priceClasses}>{product.price} €</p>
      </Link>
    </article>
  );
}
