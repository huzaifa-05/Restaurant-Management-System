import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout.jsx";
import { Home } from "../pages/Home.jsx";
import { Menu } from "../pages/Menu.jsx";
import { MenuCategory } from "../pages/MenuCategory.jsx";
import { ItemDetails } from "../pages/ItemDetails.jsx";
import { Cart } from "../pages/Cart.jsx";
import { Checkout } from "../pages/Checkout.jsx";
import { OrderConfirmation } from "../pages/OrderConfirmation.jsx";
import { OrderHistory } from "../pages/OrderHistory.jsx";
import { Profile } from "../pages/Profile.jsx";
import { AdminDashboard } from "../pages/AdminDashboard.jsx";
import { AdminMenuManagement } from "../pages/AdminMenuManagement.jsx";
import { AdminOrderManagement } from "../pages/AdminOrderManagement.jsx";
import { Unauthorized } from "../pages/Unauthorized.jsx";
import { ProtectedAdminRoute } from "../components/ProtectedAdminRoute.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/category/:category" element={<MenuCategory />} />
        <Route path="/menu/items/:id" element={<ItemDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<OrderConfirmation />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/menu" element={<AdminMenuManagement />} />
          <Route path="/admin/orders" element={<AdminOrderManagement />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
