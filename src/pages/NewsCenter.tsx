import { useState, useMemo } from "react";
import type { NewsItem } from "../types";
import { newsItems, urgentNews, pinnedNews } from "../data/mockData";
import SearchBar from "../components/ui/SearchBar";
import SectionHeader from "../components/ui/SectionHeader";
import PinnedAlertCard from "../components/ui/PinnedAlertCard";
import NewsCard from "../components/ui/NewsCard";

type NewsFilter = "all" | "general" | "hr" | "safety" | "production" | "engineering" | "urgent";

const filterChips: { key: NewsFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "general", label: "General" },
  { key: "hr", label: "HR" },
  { key: "safety", label: "Safety" },
  { key: "production", label: "Production" },
  { key: "engineering", label: "Engineering" },
  { key: "urgent", label: "Urgent" },
];

/** Map filter keys to the category strings used in mock data */
function matchesFilter(item: NewsItem, filter: NewsFilter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "general":
      return ["Company", "IT", "PreCon"].includes(item.category);
    case "hr":
      return item.category === "HR";
    case "safety":
      return item.urgency === "urgent";
    case "production":
      return item.category === "Manufacturing";
    case "engineering":
      return item.category === "Engineering";
    case "urgent":
      return item.urgency === "urgent" || item.urgency === "pinned";
    default:
      return true;
  }
}

export default function NewsCenter() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<NewsFilter>("all");

  const alertItems = useMemo(
    () => [...urgentNews, ...pinnedNews],
    [],
  );

  const feedItems = useMemo(() => {
    let list = newsItems.filter((n) => n.urgency === "normal");

    if (activeFilter !== "all") {
      list = list.filter((n) => matchesFilter(n, activeFilter));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.author?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [activeFilter, search]);

  const unreadCount = newsItems.filter((n) => !n.isRead).length;

  return (
    <div className="mg-page news-page">
      {/* ── Header area ─────────────────────────────── */}
      <section className="news-top">
        <div className="news-top-row">
          <p className="mg-subtitle">Company communications &amp; updates</p>
          {unreadCount > 0 && (
            <span className="news-unread-count">{unreadCount} new</span>
          )}
        </div>
        <SearchBar placeholder="Search news..." value={search} onChange={setSearch} />
      </section>

      {/* ── Filter chips ────────────────────────────── */}
      <div className="news-chips">
        {filterChips.map((c) => (
          <button
            key={c.key}
            className={`apps-tab ${activeFilter === c.key ? "apps-tab--active" : ""} ${c.key === "urgent" ? "news-chip--urgent" : ""}`}
            onClick={() => setActiveFilter(c.key)}
          >
            {c.key === "urgent" && "⚠ "}
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Pinned & Urgent alerts ───────────────────── */}
      {activeFilter === "all" && alertItems.length > 0 && (
        <section className="mg-section">
          <SectionHeader title="Alerts &amp; Pinned" icon="📌" />
          <div className="news-alerts">
            {alertItems.map((item) => (
              <PinnedAlertCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* ── News Feed ───────────────────────────────── */}
      <section className="mg-section">
        <SectionHeader title="Latest Updates" icon="📰" />
        {feedItems.length === 0 ? (
          <div className="news-empty">
            <span className="news-empty-icon">📭</span>
            <p>No news matches your filters</p>
          </div>
        ) : (
          <div className="news-feed">
            {feedItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
