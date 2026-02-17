import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

export default function CartModal({ open, onClose }) {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const isLogged = useAuthStore((s) => s.isLogged);

  if (!open) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  function handleBuy() {
    if (!isLogged) {
      onClose();
      navigate("/login");
      return;
    }

    clearCart();
    onClose();
    alert("Compra realizada (simulada)");
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-panel">
        <div className="modal-header">
          <h2>Carrito</h2>
          <button type="button" onClick={onClose}>Cerrar</button>
        </div>

        <ul className="cart-list">
          {items.length === 0 && <li>Tu carrito está vacío.</li>}

          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} />
              <div>
                <p>{item.title}</p>
                <p>{item.quantity} x {item.price} €</p>
                <button type="button" onClick={() => removeItem(item.id)}>Quitar</button>
              </div>
            </li>
          ))}
        </ul>

        <div className="modal-footer">
          <p>Total: {total} €</p>
          <button type="button" onClick={handleBuy} disabled={items.length === 0} className="btn-primary">
            {isLogged ? "Comprar" : "Inicia sesión para comprar"}
          </button>
        </div>
      </div>
    </div>
  );
}
