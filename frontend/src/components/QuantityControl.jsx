import { Minus, Plus } from "lucide-react";

export function QuantityControl({ quantity, onIncrease, onDecrease }) {
  return (
    <div className="quantity-control">
      <button type="button" onClick={onDecrease} title="Decrease quantity">
        <Minus size={16} />
      </button>
      <span>{quantity}</span>
      <button type="button" onClick={onIncrease} title="Increase quantity">
        <Plus size={16} />
      </button>
    </div>
  );
}
