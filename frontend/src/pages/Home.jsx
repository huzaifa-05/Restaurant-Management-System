import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { menuApi } from "../api/menuApi";
import { MenuCard } from "../components/MenuCard.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { useAsync } from "../hooks/useAsync";

const sections = [
  ["Featured Burgers", "Beef Burgers"],
  ["Popular Pizzas", "Pizza"],
  ["Biryani Specials", "Biryani"],
  ["Pasta Favorites", "Pasta"]
];

export function Home() {
  const { data, loading, error } = useAsync(menuApi.getItems, []);
  const items = data || [];

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Foodie WE</p>
          <h1>Foodie WE</h1>
          <p>Big Flavor. Fresh Food. Your Way.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/menu">
              <ShoppingBag size={20} />
              Explore Menu
            </Link>
            <Link className="secondary-button light" to="/checkout">
              Order Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {loading && <LoadingState label="Loading Foodie WE favorites" />}
      {error && <ErrorState message={error} />}

      {!loading &&
        !error &&
        sections.map(([title, category]) => {
          const sectionItems = items.filter((item) => item.category === category && item.featured).slice(0, 3);
          return (
            <section className="content-section" key={category}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{category}</p>
                  <h2>{title}</h2>
                </div>
                <Link to={`/menu/category/${encodeURIComponent(category)}`}>View all</Link>
              </div>
              <div className="menu-grid">
                {sectionItems.map((item) => (
                  <MenuCard item={item} key={item.id} />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}
