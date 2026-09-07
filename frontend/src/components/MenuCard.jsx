import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/currency";

export function MenuCard({ item }) {
  const { addItem } = useCart();

  return (
    <article className="menu-card">
      <Link to={`/menu/items/${item.id}`} className="menu-image-link" aria-label={`View ${item.name}`}>
        <img src={item.image} alt={item.name} />
      </Link>
      <div className="menu-card-body">
        <div className="card-title-row">
          <h3>{item.name}</h3>
          <span className={item.available ? "pill available" : "pill unavailable"}>
            {item.available ? "Available" : "Unavailable"}
          </span>
        </div>
        <p>{item.description}</p>
        <div className="card-actions">
          <strong>{formatCurrency(item.price)}</strong>
          <div className="button-pair">
            <Link className="ghost-icon" to={`/menu/items/${item.id}`} title="View details">
              <Search size={18} />
            </Link>
            <button className="primary-icon" disabled={!item.available} onClick={() => addItem(item)} title="Add to cart">
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
