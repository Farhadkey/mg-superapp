import { useMemo } from "react";
import type { NavigablePageProps } from "../types";
import { apps } from "../data/mockData";
// import { apps, newsItems, dashboardStats } from "../data/mockData"; // full imports for future reactivation
import { useUserProfile } from "../context/UserProfileContext";
import { filterAppsByPermission } from "../utils/appPermissions";
import SectionHeader from "../components/ui/SectionHeader";
import AppCard from "../components/ui/AppCard";
import departmentColors from "../utils/departmentColors";
// import KPIStatCard from "../components/ui/KPIStatCard";  // temporarily unused
// import NewsCard from "../components/ui/NewsCard";        // temporarily unused
// const mfgNews = newsItems                         // temporarily unused
//   .filter((n) => n.category === "Manufacturing")
//   .slice(0, 3);

// temporarily unused — Quick Access feature inactive
// const quickLinks: QuickLink[] = [
//   { icon: "📊", label: "Production Dashboard", detail: "Real-time metrics" },
//   { icon: "🔧", label: "Work Orders", detail: "12 active" },
//   { icon: "📦", label: "Inventory", detail: "Stock levels" },
//   { icon: "🔍", label: "Quality Control", detail: "2 inspections" },
//   { icon: "🛠️", label: "Maintenance", detail: "Scheduled tasks" },
//   { icon: "📈", label: "Shift Reports", detail: "Today's log" },
// ];

export default function ManufacturingHub({ onNavigate }: NavigablePageProps) {
  const { profile } = useUserProfile();
  const mfgApps = useMemo(() => filterAppsByPermission(apps, profile.appPermissions).filter((a) => a.category === "Manufacturing & Production"), [profile.appPermissions]);

  return (
    <div className="mg-page hub-page">
      {/* ── Header ──────────────────────────────── */}
      <section className="hub-header">
        <div className="hub-header-icon" style={{ backgroundColor: departmentColors["Manufacturing & Production"] }}>🏭</div>
        <div>
          <h2 className="hub-header-title">Manufacturing &amp; Production</h2>
          <p className="hub-header-desc">
            Production floor tools, quality tracking, and operational metrics.
          </p>
        </div>
      </section>

      {/* ── KPI Snapshot ────────────────────────── */}
      {/* TEMPORARILY HIDDEN — KPI feature inactive
      <section className="mg-section">
        <SectionHeader title="Today's Snapshot" icon="📊" />
        <div className="hub-kpi-grid">
          {dashboardStats.map((s) => (
            <KPIStatCard key={s.label} stat={s} />
          ))}
        </div>
      </section>
      */}

      {/* ── Production Tools ────────────────────── */}
      <section className="mg-section">
        <SectionHeader title="Production Tools" icon="🛠️" />
        <div className="hub-tools-list">
          {mfgApps.map((app) => (
            <AppCard key={app.id} app={app} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* ── Quick Access ── TEMPORARILY HIDDEN */}

      {/* ── Production Updates ── TEMPORARILY HIDDEN */}
    </div>
  );
}
