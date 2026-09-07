import { orderApi } from "../api/orderApi";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync";
import { formatCurrency } from "../utils/currency";

export function OrderHistory() {
  const { currentUser } = useAuth();
  const { data, loading, error } = useAsync(() => orderApi.getUserOrders(currentUser.id), [currentUser.id]);

  return (
    <section className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">User {currentUser.fullName}</p>
        <h1>Order History</h1>
      </div>
      {loading && <LoadingState label="Loading orders" />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <div className="order-list">
          {data.length === 0 && <div className="state-box">No orders yet.</div>}
          {data.map((order) => (
            <article className="order-row" key={order.orderId}>
              <div>
                <h3>{order.orderId}</h3>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className="pill available">{order.status}</span>
              <strong>{formatCurrency(order.totalAmount)}</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
