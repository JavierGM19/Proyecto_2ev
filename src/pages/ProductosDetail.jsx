import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/fakeStoreApi";
import { useCartStore } from "../store/cartStore";

export default function ProductosDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const addItem = useCartStore((s) => s.addItem);

    const { data, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
    });

    if (isLoading) return <p>Cargando producto...</p>;
    if (error) return <p>Error cargando producto</p>;
    if (!data) return <p>No existe el producto</p>;

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <p className="mt-2 text-sm">{data.category}</p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <img
                    src={data.image}
                    alt={data.title}
                    className="w-full max-w-sm object-contain"
                />

                <div>
                    <p className="text-lg font-semibold">{data.price} €</p>
                    <p className="mt-4">{data.description}</p>

                    <button
                        type="button"
                        onClick={() => {
                            addItem(data);
                            navigate("/", { replace: true });
                        }}
                        className="mt-6 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        Añadir al carrito
                    </button>
                </div>
            </div>
        </div>
    );
}
