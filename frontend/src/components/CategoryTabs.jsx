import { Link, useLocation } from "react-router-dom";

const categories = ["All", "Beef Burgers", "Pizza", "Pasta", "Biryani"];

export function CategoryTabs({ active = "All" }) {
  const location = useLocation();

  return (
    <div className="tabs" aria-label="Menu categories">
      {categories.map((category) => {
        const to = category === "All" ? "/menu" : `/menu/category/${encodeURIComponent(category)}`;
        const selected = active === category || (category === "All" && location.pathname === "/menu");
        return (
          <Link key={category} className={selected ? "tab active" : "tab"} to={to}>
            {category}
          </Link>
        );
      })}
    </div>
  );
}
