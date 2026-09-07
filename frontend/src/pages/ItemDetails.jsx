import { Link, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { menuApi } from "../api/menuApi";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAsync } from "../hooks/useAsync";
import { formatCurrency } from "../utils/currency";

export function ItemDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { data: item, loading, error } = useAsync(() => menuApi.getItem(id), [id]);

  if (loading) return <LoadingState label="Loading item" />;
  if (error) return <ErrorState message={error} />;

  return (
    <section className="details-layout">
      <img className="details-image" src={item.image} alt={item.name} />
      <div className="details-panel">
        <p className="eyebrow">{item.category}</p>
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        <div className="details-meta">
          <strong>{formatCurrency(item.price)}</strong>
          <span className={item.available ? "pill available" : "pill unavailable"}>
            {item.available ? "Available" : "Unavailable"}
          </span>
        </div>
        <div className="hero-actions">
          <button className="primary-button" disabled={!item.available} onClick={() => addItem(item)}>
            <ShoppingCart size={20} />
            Add to Cart
          </button>
          <Link className="secondary-button" to="/menu">
            Back to Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
