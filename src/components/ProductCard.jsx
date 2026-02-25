import { Link } from "react-router-dom";
import { translateApiTerm } from "../i18n/apiDictionary";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image-wrap">
          <img src={product.image} alt={product.title} className="product-image" loading="lazy" />
        </div>

        <p className="product-category">{product.category}</p>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">{product.price} €</p>
      </Link>
    </article>
  );
}
