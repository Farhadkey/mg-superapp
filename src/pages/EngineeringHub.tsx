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
// const engNews = newsItems              // temporarily unused
//   .filter((n) => n.category === "Engineering")
//   .slice(0, 3);

// temporarily unused — Quick Links feature inactive
// const quickLinks: QuickLink[] = [
//   { icon: "📐", label: "Design Reviews", detail: "3 pending" },
//   { icon: "📁", label: "Project Files", detail: "Shared drawings" },
//   { icon: "🧪", label: "Testing Lab", detail: "4 tests in progress" },
//   { icon: "⚡", label: "Change Requests", detail: "ECR queue" },
//   { icon: "📋", label: "Specifications", detail: "Product specs" },
//   { icon: "💻", label: "CAD Library", detail: "Templates & models" },
// ];

export default function EngineeringHub({ onNavigate }: NavigablePageProps) {
  const { profile } = useUserProfile();
  const engApps = useMemo(() => filterAppsByPermission(apps, profile.appPermissions).filter((a) => a.category === "Engineering"), [profile.appPermissions]);

  return (
    <div className="mg-page hub-page">
      {/* ── Header ──────────────────────────────── */}
      <section className="hub-header">
        <div className="hub-header-icon" style={{ backgroundColor: departmentColors["Engineering"] }}>📐</div>
        <div>
          <h2 className="hub-header-title">Engineering</h2>
          <p className="hub-header-desc">
            BIM tracking, project management, design reviews, and engineering resources.
          </p>
        </div>
      </section>

      {/* ── Engineering Tools ───────────────────── */}
      <section className="mg-section">
        <SectionHeader title="Engineering Tools" icon="🛠️" />
        <div className="hub-tools-list">
          {engApps.map((app) => (
            <AppCard key={app.id} app={app} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* ── Quick Links ── TEMPORARILY HIDDEN */}

      {/* ── Engineering Updates ── TEMPORARILY HIDDEN */}
    </div>
  );
}
