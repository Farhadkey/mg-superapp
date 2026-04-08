import { useState, useMemo, useCallback } from "react";
import type { StoreItem, StoreCategory } from "../types";
import { storeItems } from "../data/mockData";
import SearchBar from "../components/ui/SearchBar";
import SectionHeader from "../components/ui/SectionHeader";
import ProductCard from "../components/ui/ProductCard";

type StoreFilter = "all" | StoreCategory;

const filterChips: { key: StoreFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Apparel", label: "Apparel" },
  { key: "PPE", label: "PPE" },
  { key: "Merch", label: "Merch" },
];

export default function Store() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<StoreFilter>("all");
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  const cartCount = useMemo(
    () => Array.from(cart.values()).reduce((s, n) => s + n, 0),
    [cart],
  );

  const handleAdd = useCallback((item: StoreItem) => {
    setCart((prev) => {
      const next = new Map(prev);
      next.set(item.id, (next.get(item.id) ?? 0) + 1);
      return next;
    });
  }, []);

  const featured = useMemo(
    () => storeItems.filter((s) => s.isFeatured && s.inStock !== false),
    [],
  );

  const filtered = useMemo(() => {
    let list = storeItems;
    if (activeFilter !== "all") {
      list = list.filter((s) => s.category === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeFilter, search]);

  return (
    <div className="mg-page store-page">
      {/* ── Top area ───────────────────────────────── */}
      <section className="store-top">
        <p className="mg-subtitle">Company merch, PPE, and branded gear</p>
        <SearchBar placeholder="Search products..." value={search} onChange={setSearch} />
      </section>

      {/* ── Filter chips ───────────────────────────── */}
      <div className="store-chips">
        {filterChips.map((c) => (
          <button
            key={c.key}
            className={`apps-tab ${activeFilter === c.key ? "apps-tab--active" : ""}`}
            onClick={() => setActiveFilter(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Featured ──────────────────────────────── */}
      {activeFilter === "all" && !search && (
        <section className="mg-section">
          <SectionHeader title="Featured" icon="⭐" />
          <div className="store-featured">
            {featured.map((item) => (
              <div key={item.id} className="store-featured-card">
                <div className="store-featured-icon">{item.icon}</div>
                <span className="store-featured-name">{item.name}</span>
                <span className="store-featured-price">{item.price}</span>
                <button
                  className="store-featured-add"
                  onClick={() => handleAdd(item)}
                  aria-label={`Add ${item.name} to cart`}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Product grid ───────────────────────────── */}
      <section className="mg-section">
        <SectionHeader title="All Products" icon="🛍️" />
        {filtered.length === 0 ? (
          <div className="store-empty">
            <span className="store-empty-icon">🔍</span>
            <p>No products match your search</p>
          </div>
        ) : (
          <div className="store-grid">
            {filtered.map((item) => (
              <ProductCard key={item.id} item={item} onAddToCart={handleAdd} />
            ))}
          </div>
        )}
      </section>

      {/* ── Floating cart button ───────────────────── */}
      {cartCount > 0 && (
        <div className="store-cart-fab">
          <span className="store-cart-fab-icon">🛒</span>
          <span className="store-cart-fab-label">Cart</span>
          <span className="store-cart-fab-count">{cartCount}</span>
        </div>
      )}
    </div>
  );
}
