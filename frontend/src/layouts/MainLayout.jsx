import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";

export function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
