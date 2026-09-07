import { menuApi } from "../api/menuApi";
import { CategoryTabs } from "../components/CategoryTabs.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { MenuCard } from "../components/MenuCard.jsx";
import { useAsync } from "../hooks/useAsync";

export function Menu() {
  const { data, loading, error } = useAsync(menuApi.getItems, []);

  return (
    <section className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Fresh today</p>
        <h1>Menu</h1>
      </div>
      <CategoryTabs active="All" />
      {loading && <LoadingState label="Loading menu" />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <div className="menu-grid">
          {data.map((item) => (
            <MenuCard item={item} key={item.id} />
          ))}
        </div>
      )}
    </section>
  );
}
