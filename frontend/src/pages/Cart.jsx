import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { QuantityControl } from "../components/QuantityControl.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/currency";

export function Cart() {
  const { items, subtotal, total, increase, decrease, removeItem } = useCart();

  return (
    <section className="page-shell narrow">
      <div className="page-heading">
        <p className="eyebrow">Your order</p>
        <h1>Cart</h1>
      </div>
      {items.length === 0 ? (
        <div className="state-box">
          Your cart is empty.
          <Link to="/menu">Browse the menu</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>{formatCurrency(item.price)}</p>
                </div>
                <QuantityControl
                  quantity={item.quantity}
                  onIncrease={() => increase(item.id)}
                  onDecrease={() => decrease(item.id)}
                />
                <button className="ghost-icon danger" onClick={() => removeItem(item.id)} title="Remove item">
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>
          <aside className="summary">
            <h2>Summary</h2>
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <Link className="primary-button full" to="/checkout">
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
