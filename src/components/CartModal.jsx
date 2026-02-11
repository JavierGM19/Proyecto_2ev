import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

function formatEUR(value) {
    try {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    } catch {
        return `${value} €`;
    }
}

export default function CartModal({ open, onClose }) {
    const navigate = useNavigate();

    const items = useCartStore((s) => s.items);
    const removeItem = useCartStore((s) => s.removeItem);
    const setQuantity = useCartStore((s) => s.setQuantity);
    const clearCart = useCartStore((s) => s.clearCart);
    const totalPrice = useCartStore((s) => s.totalPrice);

    const isLogged = useAuthStore((s) => s.isLogged);

    useEffect(() => {
        if (!open) return;

        function onKeyDown(e) {
            if (e.key === "Escape") onClose?.();
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    const total = totalPrice();

    const handleBuy = () => {
        if (!isLogged) {
            onClose?.();
            navigate("/login");
            return;
        }

        // Compra simulada
        alert("Compra realizada (simulada). ¡Gracias!");
        clearCart();
        onClose?.();
        navigate("/", { replace: true });
    };

    return (
        <div className="fixed inset-0 z-[60]">
            {/* Overlay */}
            <button
                type="button"
                aria-label="Cerrar carrito"
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Carrito</h2>
                            <p className="text-sm text-gray-500">
                                {items.length === 0
                                    ? "Tu carrito está vacío"
                                    : `Productos: ${items.length}`}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Cerrar
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto px-5 py-4">
                        {items.length === 0 ? (
                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                                Añade productos desde el detalle para verlos aquí.
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {items.map((item) => {
                                    const subtotal = item.price * item.quantity;

                                    return (
                                        <li
                                            key={item.id}
                                            className="rounded-2xl border border-gray-200 p-4"
                                        >
                                            <div className="flex gap-3">
                                                <div className="h-16 w-16 flex-none rounded-xl bg-gray-50 p-2">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-full w-full object-contain"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                                                        {item.title}
                                                    </p>

                                                    <div className="mt-1 flex items-center justify-between">
                                                        <p className="text-sm text-gray-700">
                                                            {formatEUR(item.price)}
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {formatEUR(subtotal)}
                                                        </p>
                                                    </div>

                                                    <div className="mt-3 flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                setQuantity(item.id, e.target.value)
                                                            }
                                                            className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-400"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.id)}
                                                            className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Borrar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <div className="border-t border-gray-200 px-5 py-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total</span>
                            <span className="font-semibold text-gray-900">
                                {formatEUR(total)}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleBuy}
                            disabled={items.length === 0}
                            className={[
                                "mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition",
                                items.length === 0
                                    ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                    : "bg-gray-900 text-white hover:bg-gray-800",
                            ].join(" ")}
                        >
                            {isLogged
                                ? `Comprar — ${formatEUR(total)}`
                                : "Inicia sesión para comprar"}
                        </button>

                        {!isLogged && items.length > 0 && (
                            <p className="mt-2 text-xs text-gray-500">
                                Puedes añadir productos sin sesión, pero necesitas iniciar
                                sesión para finalizar la compra.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
