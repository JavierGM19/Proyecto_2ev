import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/fakeStoreApi";
import { useCartStore } from "../store/cartStore";

export default function ProductosDetail() {
  const { id } = useParams();
  const addItem = useCartStore((s) => s.addItem);

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  if (isLoading) return <p>Cargando producto...</p>;
  if (error) return <p>Error cargando producto.</p>;
  if (!data) return <p>Producto no encontrado.</p>;

  return (
    <section className="detail-layout">
      <div className="detail-image-wrap">
        <img src={data.image} alt={data.title} className="detail-image" />
      </div>

      <div>
        <h1>{data.title}</h1>
        <p className="product-category">{data.category}</p>
        <p className="product-price">{data.price} €</p>
        <p>{data.description}</p>

        <button type="button" onClick={() => addItem(data)} className="btn-primary">
          Añadir al carrito
        </button>
      </div>
    </section>
  );
}
