import { useMemo } from "react";
import type { NavigablePageProps } from "../types";
import { apps } from "../data/mockData";
// import { apps, dashboardStats, reportSummaries } from "../data/mockData"; // dashboardStats, reportSummaries temporarily unused
import { useUserProfile } from "../context/UserProfileContext";
import { filterAppsByPermission } from "../utils/appPermissions";
import SectionHeader from "../components/ui/SectionHeader";
import AppCard from "../components/ui/AppCard";
import departmentColors from "../utils/departmentColors";
// import KPIStatCard from "../components/ui/KPIStatCard"; // temporarily unused
// import SearchBar from "../components/ui/SearchBar"; // temporarily unused

// temporarily unused — Recent Reports hidden
// const statusLabel: Record<string, string> = {
//   current: "Current",
//   outdated: "Outdated",
//   generating: "Generating",
// };

export default function ReportsHub({ onNavigate }: NavigablePageProps) {
  const { profile } = useUserProfile();
  const reportApps = useMemo(() => filterAppsByPermission(apps, profile.appPermissions).filter((a) => a.category === "Reports"), [profile.appPermissions]);
  // const [search, setSearch] = useState(""); // temporarily unused
  // const filtered = useMemo(() => { ... }); // temporarily unused

  return (
    <div className="mg-page hub-page">
      {/* ── Header ──────────────────────────────── */}
      <section className="hub-header">
        <div className="hub-header-icon" style={{ backgroundColor: departmentColors["Reports"] }}>📊</div>
        <div>
          <h2 className="hub-header-title">Reports</h2>
          <p className="hub-header-desc">
            Company-wide reports, analytics, and operational dashboards.
          </p>
        </div>
      </section>

      {/* ── KPI Summary ── TEMPORARILY HIDDEN */}

      {/* ── Report Tools ────────────────────────── */}
      <section className="mg-section">
        <SectionHeader title="Report Tools" icon="🛠️" />
        <div className="hub-tools-list">
          {reportApps.map((app) => (
            <AppCard key={app.id} app={app} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* ── Recent Reports ── TEMPORARILY HIDDEN */}
    </div>
  );
}
