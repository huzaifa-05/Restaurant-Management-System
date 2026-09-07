import { Link } from "react-router-dom";
import { ClipboardList, LayoutDashboard, Utensils } from "lucide-react";

export function AdminDashboard() {
  return (
    <section className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Restaurant staff</p>
        <h1>Admin Dashboard</h1>
      </div>
      <div className="admin-tiles">
        <Link className="admin-tile" to="/admin/menu">
          <Utensils size={28} />
          <h2>Menu Management</h2>
          <p>Add, edit, delete, and update availability for Foodie WE dishes.</p>
        </Link>
        <Link className="admin-tile" to="/admin/orders">
          <ClipboardList size={28} />
          <h2>Order Management</h2>
          <p>View current orders and move them through the kitchen workflow.</p>
        </Link>
        <div className="admin-tile muted">
          <LayoutDashboard size={28} />
          <h2>Operations</h2>
          <p>Built as independent services for later ECS Fargate deployment.</p>
        </div>
      </div>
    </section>
  );
}
