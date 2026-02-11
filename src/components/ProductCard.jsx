import { Link } from "react-router-dom";

export default function ProductCard({ product, compact = false }) {
  const wrapperClasses = compact
    ? "group h-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    : "group h-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md";

  const imageWrapperClasses = compact
    ? "mb-3 flex aspect-square items-center justify-center rounded-lg bg-gray-50 p-4"
    : "mb-4 flex aspect-square items-center justify-center rounded-xl bg-gray-50 p-6";

  const titleClasses = compact
    ? "mt-2 text-xs font-semibold text-gray-900 leading-5"
    : "mt-2 min-h-12 text-sm font-semibold text-gray-900";

  const categoryClasses = compact
    ? "text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400"
    : "text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400";

  const priceClasses = compact ? "mt-2 text-sm font-semibold text-gray-900" : "mt-3 text-base font-semibold text-gray-900";

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
