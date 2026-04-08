import { useMemo } from "react";
import type { NavigablePageProps } from "../types";
// import type { NavigablePageProps, QuickLink } from "../types"; // QuickLink temporarily unused
import { apps } from "../data/mockData";
// import { apps, newsItems } from "../data/mockData"; // newsItems temporarily unused
import { useUserProfile } from "../context/UserProfileContext";
import { filterAppsByPermission } from "../utils/appPermissions";
import SectionHeader from "../components/ui/SectionHeader";
import AppCard from "../components/ui/AppCard";
import departmentColors from "../utils/departmentColors";
// import NewsCard from "../components/ui/NewsCard"; // temporarily unused
// const preconNews = newsItems           // temporarily unused
//   .filter((n) => n.category === "PreCon")
//   .slice(0, 3);

// temporarily unused — Quick Links feature inactive
// const quickLinks: QuickLink[] = [
//   { icon: "💰", label: "Active Bids", detail: "6 in progress" },
//   { icon: "📊", label: "Estimating", detail: "Cost calculators" },
//   { icon: "📑", label: "Submittals", detail: "4 awaiting review" },
//   { icon: "🤝", label: "Client Contacts", detail: "CRM directory" },
//   { icon: "📎", label: "Templates", detail: "Proposal & bid docs" },
//   { icon: "🏗️", label: "Project Tracker", detail: "Pipeline view" },
// ];

export default function PreConHub({ onNavigate }: NavigablePageProps) {
  const { profile } = useUserProfile();
  const preconApps = useMemo(() => filterAppsByPermission(apps, profile.appPermissions).filter((a) => a.category === "PreCon"), [profile.appPermissions]);

  return (
    <div className="mg-page hub-page">
      {/* ── Header ──────────────────────────────── */}
      <section className="hub-header">
        <div className="hub-header-icon" style={{ backgroundColor: departmentColors["PreCon"] }}>🔗</div>
        <div>
          <h2 className="hub-header-title">PreCon</h2>
          <p className="hub-header-desc">
            Pre-construction estimating, bid management, and SOV tracking.
          </p>
        </div>
      </section>

      {/* ── PreCon Tools ────────────────────────── */}
      <section className="mg-section">
        <SectionHeader title="PreCon Tools" icon="🛠️" />
        <div className="hub-tools-list">
          {preconApps.map((app) => (
            <AppCard key={app.id} app={app} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* ── Quick Links ── TEMPORARILY HIDDEN */}

      {/* ── PreCon Updates ── TEMPORARILY HIDDEN */}
    </div>
  );
}
