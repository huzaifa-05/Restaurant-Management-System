import { Edit, Power, Trash2 } from "lucide-react";
import { useState } from "react";
import { menuApi } from "../api/menuApi";
import { AdminMenuForm } from "../components/AdminMenuForm.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { useAsync } from "../hooks/useAsync";
import { formatCurrency } from "../utils/currency";

export function AdminMenuManagement() {
  const { data, loading, error, reload } = useAsync(menuApi.getItems, []);
  const [editingItem, setEditingItem] = useState(null);
  const [actionError, setActionError] = useState("");

  async function saveItem(payload) {
    setActionError("");
    try {
      if (editingItem) {
        await menuApi.updateItem(editingItem.id, payload);
      } else {
        await menuApi.createItem(payload);
      }
      setEditingItem(null);
      await reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function deleteItem(id) {
    setActionError("");
    try {
      await menuApi.deleteItem(id);
      await reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function toggleAvailability(item) {
    setActionError("");
    try {
      await menuApi.setAvailability(item.id, !item.available);
      await reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <section className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Admin</p>
        <h1>Menu Management</h1>
      </div>
      <AdminMenuForm editingItem={editingItem} onSubmit={saveItem} onCancel={() => setEditingItem(null)} />
      {actionError && <ErrorState message={actionError} />}
      {loading && <LoadingState label="Loading menu items" />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="table-item">
                      <img src={item.image} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{item.available ? "Available" : "Unavailable"}</td>
                  <td>
                    <div className="table-actions">
                      <button className="ghost-icon" onClick={() => setEditingItem(item)} title="Edit item">
                        <Edit size={17} />
                      </button>
                      <button className="ghost-icon" onClick={() => toggleAvailability(item)} title="Toggle availability">
                        <Power size={17} />
                      </button>
                      <button className="ghost-icon danger" onClick={() => deleteItem(item.id)} title="Delete item">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
