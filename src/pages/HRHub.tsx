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
// const hrNews = newsItems.filter(           // temporarily unused
//   (n) => n.category === "HR" || n.category === "Company",
// ).slice(0, 3);

// temporarily unused — Quick Access feature inactive
// const quickLinks: QuickLink[] = [
//   { icon: "📅", label: "Time Off Requests", detail: "2 pending" },
//   { icon: "📄", label: "Pay Stubs", detail: "Latest: Mar 15" },
//   { icon: "📋", label: "Benefits", detail: "Open enrollment" },
//   { icon: "📚", label: "Training", detail: "3 modules due" },
//   { icon: "🏥", label: "Safety Incidents", detail: "Report / view" },
//   { icon: "📝", label: "Policies", detail: "Handbook" },
// ];

export default function HRHub({ onNavigate }: NavigablePageProps) {
  const { profile } = useUserProfile();
  const hrApps = useMemo(() => filterAppsByPermission(apps, profile.appPermissions).filter((a) => a.category === "HR"), [profile.appPermissions]);

  return (
    <div className="mg-page hub-page">
      {/* ── Header ──────────────────────────────── */}
      <section className="hub-header">
        <div className="hub-header-icon" style={{ backgroundColor: departmentColors["HR"] }}>👥</div>
        <div>
          <h2 className="hub-header-title">Human Resources</h2>
          <p className="hub-header-desc">
            Self-service portal for time tracking, payroll, benefits, and HR tools.
          </p>
        </div>
      </section>

      {/* ── HR Tools ────────────────────────────── */}
      <section className="mg-section">
        <SectionHeader title="HR Tools" icon="🛠️" />
        <div className="hub-tools-list">
          {hrApps.map((app) => (
            <AppCard key={app.id} app={app} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* ── Quick Access ────────────────────────── */}
      {/* TEMPORARILY HIDDEN — Quick Access feature inactive
      <section className="mg-section">
        <SectionHeader title="Quick Access" icon="⚡" />
        <div className="hub-quick-grid">
          {quickLinks.map((l) => (
            <div key={l.label} className="hub-quick-card">
              <span className="hub-quick-icon">{l.icon}</span>
              <div className="hub-quick-info">
                <span className="hub-quick-label">{l.label}</span>
                <span className="hub-quick-detail">{l.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      */}

      {/* ── HR Updates ── TEMPORARILY HIDDEN */}
    </div>
  );
}
