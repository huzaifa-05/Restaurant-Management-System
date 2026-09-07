import { Link, NavLink } from "react-router-dom";
import { ClipboardList, LogIn, LogOut, ShoppingCart, UserRound, Utensils } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function Navbar() {
  const { count } = useCart();
  const { currentUser, isAdmin, signOut, isAuthenticated } = useAuth();

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-mark">FW</span>
        <span>Foodie WE</span>
      </Link>
      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        {isAdmin() && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-actions">
        {isAdmin() && (
          <Link className="icon-link" to="/admin/orders" title="Admin orders">
            <ClipboardList size={20} />
          </Link>
        )}
        <Link className="icon-link cart-link" to="/cart" title="Cart">
          <ShoppingCart size={20} />
          {count > 0 && <span>{count}</span>}
        </Link>
        {isAuthenticated ? (
          <Link className="icon-link" to="/profile" title={currentUser?.fullName || "Profile"}>
            <UserRound size={20} />
          </Link>
        ) : (
          <Link className="icon-link" to="/login?next=/checkout" title="Sign in">
            <LogIn size={20} />
          </Link>
        )}
        {isAuthenticated ? (
          <button className="primary-small" onClick={signOut} type="button" title="Sign out">
            <LogOut size={18} />
            Sign out
          </button>
        ) : (
          <Link className="primary-small" to="/login?next=/checkout">
            <Utensils size={18} />
            Order
          </Link>
        )}
        <Link className="primary-small" to="/menu">
          <Utensils size={18} />
          Menu
        </Link>
      </div>
    </header>
  );
}
