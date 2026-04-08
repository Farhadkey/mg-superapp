import { useState, useMemo } from "react";
import type { NavigablePageProps } from "../types";
import { apps as allApps, reportSummaries } from "../data/mockData";
// import { apps, newsItems, reportSummaries, storeItems } from "../data/mockData"; // full imports for future reactivation
import { useUserProfile } from "../context/UserProfileContext";
import { filterAppsByPermission } from "../utils/appPermissions";
import { matchText } from "../utils/matchText";
import ExternalAppBadge from "../components/ui/ExternalAppBadge";

type SearchTab = "all" | "apps" | "reports";
// type SearchTab = "all" | "apps" | "news" | "reports" | "store"; // full tabs for future reactivation

const tabs: { key: SearchTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "apps", label: "Apps" },
  // { key: "news", label: "News" },     // temporarily hidden
  { key: "reports", label: "Reports" },
  // { key: "store", label: "Store" },   // temporarily hidden
];

export default function SearchResults({ onNavigate }: NavigablePageProps) {
  const { profile } = useUserProfile();
  const apps = useMemo(() => filterAppsByPermission(allApps, profile.appPermissions), [profile.appPermissions]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<SearchTab>("all");

  const q = query.trim();

  const filteredApps = useMemo(
    () =>
      q
        ? apps.filter(
            (a) => matchText(a.name, q) || matchText(a.description ?? "", q),
          )
        : [],
    [q],
  );

  const filteredNews = useMemo(() => [], [q]);
  /* TEMPORARILY HIDDEN — news feature inactive
  const filteredNews = useMemo(
    () =>
      q
        ? newsItems.filter(
            (n) => matchText(n.title, q) || matchText(n.summary, q),
          )
        : [],
    [q],
  );
  */

  const filteredReports = useMemo(
    () =>
      q
        ? reportSummaries.filter(
            (r) => matchText(r.title, q) || matchText(r.description, q),
          )
        : [],
    [q],
  );

  const filteredStore = useMemo(() => [], [q]);
  /* TEMPORARILY HIDDEN — store feature inactive
  const filteredStore = useMemo(
    () =>
      q
        ? storeItems.filter(
            (s) => matchText(s.name, q) || matchText(s.description, q),
          )
        : [],
    [q],
  );
  */

  const totalCount =
    filteredApps.length +
    filteredNews.length +
    filteredReports.length +
    filteredStore.length;

  const showApps = (tab === "all" || tab === "apps") && filteredApps.length > 0;
  const showNews = false; // temporarily disabled — news feature inactive
  const showReports =
    (tab === "all" || tab === "reports") && filteredReports.length > 0;
  const showStore = false; // temporarily disabled — store feature inactive

  const noResults = q.length > 0 && !showApps && !showNews && !showReports && !showStore;

  return (
    <div className="search-page">
      {/* Search input */}
      <div className="search-page-bar">
        <svg className="search-page-icon" width="18" height="18" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          className="search-page-input"
          type="text"
          placeholder="Search apps, news, reports, store..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {q && (
          <button className="search-page-clear" onClick={() => setQuery("")} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="search-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`search-tab${tab === t.key ? " search-tab--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="search-results">
        {!q && (
          <p className="search-empty">Type to search across apps, news, reports, and the store.</p>
        )}

        {noResults && (
          <p className="search-empty">No results for &ldquo;{q}&rdquo;</p>
        )}

        {q && totalCount > 0 && tab === "all" && (
          <p className="search-count">{totalCount} result{totalCount !== 1 ? "s" : ""}</p>
        )}

        {/* Apps */}
        {showApps && (
          <section className="search-section">
            <h3 className="search-section-title">Apps</h3>
            {filteredApps.map((app) => (
              <button
                key={app.id}
                className="search-card search-card--app"
                onClick={() => onNavigate(app.page, app)}
              >
                <span className="search-card-icon" style={{ background: app.color }}>
                  {app.icon}
                </span>
                <div className="search-card-body">
                  <span className="search-card-title">
                    {app.name}
                    {app.isExternal && <ExternalAppBadge />}
                  </span>
                  <span className="search-card-sub">{app.category}</span>
                </div>
              </button>
            ))}
          </section>
        )}

        {/* News — TEMPORARILY HIDDEN
        {showNews && (
          <section className="search-section">
            <h3 className="search-section-title">News</h3>
            {filteredNews.map((n) => (
              <div key={n.id} className="search-card search-card--news">
                <span className="search-card-icon search-card-icon--news">
                  {n.urgency === "urgent" ? "🚨" : n.urgency === "pinned" ? "📌" : "📰"}
                </span>
                <div className="search-card-body">
                  <span className="search-card-title">{n.title}</span>
                  <span className="search-card-sub">{n.category} · {n.date}</span>
                </div>
              </div>
            ))}
          </section>
        )}
        */}

        {/* Reports */}
        {showReports && (
          <section className="search-section">
            <h3 className="search-section-title">Reports</h3>
            {filteredReports.map((r) => (
              <div key={r.id} className="search-card search-card--report">
                <span className="search-card-icon search-card-icon--report">{r.icon}</span>
                <div className="search-card-body">
                  <span className="search-card-title">{r.title}</span>
                  <span className="search-card-sub">{r.category} · Updated {r.lastUpdated}</span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Store — TEMPORARILY HIDDEN
        {showStore && (
          <section className="search-section">
            <h3 className="search-section-title">Store</h3>
            {filteredStore.map((s) => (
              <div key={s.id} className="search-card search-card--store">
                <span className="search-card-icon search-card-icon--store">{s.icon}</span>
                <div className="search-card-body">
                  <span className="search-card-title">{s.name}</span>
                  <span className="search-card-sub">
                    {s.category}
                    {s.price && <> · {s.price}</>}
                    {s.inStock === false && <span className="search-oos"> · Out of stock</span>}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}
        */}
      </div>
    </div>
  );
}
