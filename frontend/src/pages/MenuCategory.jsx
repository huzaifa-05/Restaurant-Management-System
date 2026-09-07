import { useParams } from "react-router-dom";
import { menuApi } from "../api/menuApi";
import { CategoryTabs } from "../components/CategoryTabs.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { MenuCard } from "../components/MenuCard.jsx";
import { useAsync } from "../hooks/useAsync";

export function MenuCategory() {
  const { category } = useParams();
  const decoded = decodeURIComponent(category);
  const { data, loading, error } = useAsync(() => menuApi.getCategory(decoded), [decoded]);

  return (
    <section className="page-shell">
      <div className="page-heading">
        <p className="eyebrow">Category</p>
        <h1>{decoded}</h1>
      </div>
      <CategoryTabs active={decoded} />
      {loading && <LoadingState label={`Loading ${decoded}`} />}
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
