import { useState, useMemo } from "react";
import type { AppCategory, AppItem, NavigablePageProps } from "../types";
import { apps as allApps } from "../data/mockData";
// import { apps, favoriteApps, recentApps } from "../data/mockData"; // full imports for future reactivation
import { useUserProfile } from "../context/UserProfileContext";
import { filterAppsByPermission } from "../utils/appPermissions";
import SearchBar from "../components/ui/SearchBar";
import SectionHeader from "../components/ui/SectionHeader";
import AppCard from "../components/ui/AppCard";

type FilterTab = "all" | "internal" | "external";
// type FilterTab = "all" | "favorites" | "recent" | "internal" | "external"; // full tabs for future reactivation

const tabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  // { key: "favorites", label: "Favorites" },  // temporarily hidden
  // { key: "recent", label: "Recent" },          // temporarily hidden
  { key: "internal", label: "Internal" },
  { key: "external", label: "External" },
];

const categoryOrder: AppCategory[] = [
  "HR",
  "Manufacturing & Production",
  "Engineering",
  "PreCon",
  "Reports",
];

const categoryIcons: Record<AppCategory, string> = {
  HR: "👥",
  "Manufacturing & Production": "🏭",
  Engineering: "📐",
  PreCon: "🔗",
  Reports: "📈",
};

export default function AppsLauncher({ onNavigate }: NavigablePageProps) {
  const { profile } = useUserProfile();
  const apps = useMemo(() => filterAppsByPermission(allApps, profile.appPermissions), [profile.appPermissions]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  /* ── Derive the filtered list ───────────────────── */
  const filtered = useMemo(() => {
    let list: AppItem[];
    switch (activeTab) {
      // case "favorites":
      //   list = favoriteApps;
      //   break;
      // case "recent":
      //   list = recentApps;
      //   break;
      case "internal":
        list = apps.filter((a) => !a.isExternal);
        break;
      case "external":
        list = apps.filter((a) => a.isExternal);
        break;
      default:
        list = apps;
    }

    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    );
  }, [activeTab, search]);

  /* ── Group by category (preserves order) ────────── */
  const grouped = useMemo(() => {
    const map = new Map<AppCategory, AppItem[]>();
    for (const cat of categoryOrder) {
      const items = filtered.filter((a) => a.category === cat);
      if (items.length) map.set(cat, items);
    }
    return map;
  }, [filtered]);

  const showGrouped = activeTab === "all" || activeTab === "internal" || activeTab === "external";

  return (
    <div className="mg-page apps-page">
      {/* ── Search + subtitle ──────────────────────── */}
      <section className="apps-top">
        <p className="mg-subtitle">Access all Momentum Glass applications</p>
        <SearchBar
          placeholder="Search apps..."
          value={search}
          onChange={setSearch}
        />
      </section>

      {/* ── Filter tabs ────────────────────────────── */}
      <div className="apps-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`apps-tab ${activeTab === t.key ? "apps-tab--active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Results ────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="apps-empty">
          <span className="apps-empty-icon">🔍</span>
          <p>No apps match your search</p>
        </div>
      ) : showGrouped ? (
        /* Grouped view */
        categoryOrder.map((cat) => {
          const items = grouped.get(cat);
          if (!items) return null;
          return (
            <section className="mg-section" key={cat}>
              <SectionHeader
                title={cat}
                icon={categoryIcons[cat]}
              />
              <div className="apps-group-grid">
                {items.map((app) => (
                  <AppCard key={app.id} app={app} onNavigate={onNavigate} />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        /* Flat view (favorites / recent) */
        <section className="mg-section">
          <div className="apps-group-grid">
            {filtered.map((app) => (
              <AppCard key={app.id} app={app} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
