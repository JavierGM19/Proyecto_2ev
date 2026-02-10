import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block">
        <div className="mb-4 flex aspect-square items-center justify-center rounded-xl bg-gray-50 p-6">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain transition duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
          {product.category}
        </p>

        <h2 className="mt-2 min-h-12 text-sm font-semibold text-gray-900">
          {product.title}
        </h2>

        <p className="mt-3 text-base font-semibold text-gray-900">{product.price} €</p>
      </Link>
    </article>
  );
}
