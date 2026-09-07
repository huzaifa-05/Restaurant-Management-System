import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { checkout } from "../services/checkoutService";
import { formatCurrency } from "../utils/currency";

export function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    orderType: "TAKEAWAY",
    pickupTime: "",
    notes: "",
    paymentMethod: "CARD"
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (items.length === 0) {
      setError("Add at least one item before checkout.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await checkout({
        cartItems: items,
        userId: "user-1",
        ...form
      });
      clearCart();
      navigate("/confirmation", { state: result });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-shell narrow">
      <div className="page-heading">
        <p className="eyebrow">Almost there</p>
        <h1>Checkout</h1>
      </div>
      <form className="checkout-form" onSubmit={submit}>
        <label>
          Order type
          <select name="orderType" value={form.orderType} onChange={updateField}>
            <option value="DINE_IN">Dine in</option>
            <option value="TAKEAWAY">Takeaway</option>
            <option value="PRE_ORDER">Pre-order</option>
          </select>
        </label>
        <label>
          Pickup time
          <input name="pickupTime" type="datetime-local" value={form.pickupTime} onChange={updateField} />
        </label>
        <label>
          Payment method
          <select name="paymentMethod" value={form.paymentMethod} onChange={updateField}>
            <option value="CARD">Card</option>
            <option value="CASH">Cash</option>
            <option value="JAZZCASH">JazzCash</option>
            <option value="EASYPAISA">Easypaisa</option>
          </select>
        </label>
        <label>
          Notes
          <textarea name="notes" rows="4" value={form.notes} onChange={updateField} />
        </label>
        <div className="summary-line total">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button full" disabled={submitting} type="submit">
          <CreditCard size={20} />
          {submitting ? "Processing" : "Place Order"}
        </button>
      </form>
    </section>
  );
}
