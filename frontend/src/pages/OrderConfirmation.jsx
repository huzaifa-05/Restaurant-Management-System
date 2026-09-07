import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../utils/currency";

export function OrderConfirmation() {
  const { state } = useLocation();

  if (!state?.order) {
    return (
      <section className="page-shell narrow">
        <div className="state-box">
          No recent confirmation found.
          <Link to="/menu">Start a new order</Link>
        </div>
      </section>
    );
  }

  const { order, payment } = state;

  return (
    <section className="page-shell narrow">
      <div className="confirmation">
        <CheckCircle2 size={42} />
        <p className="eyebrow">Order received</p>
        <h1>{order.orderId}</h1>
        <p>Your order is {order.status.toLowerCase()} and payment is {payment.status.toLowerCase()}.</p>
        <div className="summary-line total">
          <span>Total</span>
          <strong>{formatCurrency(order.totalAmount)}</strong>
        </div>
        <Link className="primary-button full" to="/orders">
          View Order History
        </Link>
      </div>
    </section>
  );
}
