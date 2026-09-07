import { RefreshCw } from "lucide-react";
import { orderApi } from "../api/orderApi";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { useAsync } from "../hooks/useAsync";
import { formatCurrency } from "../utils/currency";

const statuses = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

export function AdminOrderManagement() {
  const { data, loading, error, reload } = useAsync(orderApi.listOrders, []);

  async function updateStatus(orderId, status) {
    await orderApi.updateStatus(orderId, status);
    await reload();
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Order Management</h1>
        </div>
        <button className="secondary-button" onClick={reload}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>
      {loading && <LoadingState label="Loading orders" />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <div className="order-list">
          {data.length === 0 && <div className="state-box">No orders have been created yet.</div>}
          {data.map((order) => (
            <article className="admin-order" key={order.orderId}>
              <div>
                <h3>{order.orderId}</h3>
                <p>
                  {order.orderType} · {new Date(order.createdAt).toLocaleString()}
                </p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.itemId}>
                      {item.quantity} x {item.itemName}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="admin-order-side">
                <strong>{formatCurrency(order.totalAmount)}</strong>
                <select value={order.status} onChange={(event) => updateStatus(order.orderId, event.target.value)}>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
