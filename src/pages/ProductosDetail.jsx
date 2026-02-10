import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/fakeStoreApi";

export default function ProductosDetail() {
    const { id } = useParams();

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
                    className="w-full max-w-sm"
                />

                <div>
                    <p className="text-lg font-semibold">{data.price} €</p>
                    <p className="mt-4">{data.description}</p>

                    <button className="mt-6 border px-4 py-2">
                        Añadir al carrito (más adelante)
                    </button>
                </div>
            </div>
        </div>
    );
}
