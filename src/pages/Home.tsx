import { useMemo } from "react";
import type { PageId, NavigablePageProps, UserProfile } from "../types";
import { openExternalUrl } from "../utils/openExternal";
import {
  // dashboardStats,  // temporarily unused — KPI feature inactive
  apps as allApps,
  // recentApps,      // temporarily unused — recent apps feature inactive
  // newsItems,       // temporarily unused — news feature inactive
  urgentNews,
  pinnedNews,
  // storeItems,      // temporarily unused — store feature inactive
} from "../data/mockData";
import { useUserProfile } from "../context/UserProfileContext";
import { filterAppsByPermission, isAppAllowed } from "../utils/appPermissions";
import SectionHeader from "../components/ui/SectionHeader";
import QuickActionCard from "../components/ui/QuickActionCard";
import DepartmentShortcutCard from "../components/ui/DepartmentShortcutCard";
import departmentColors from "../utils/departmentColors";
// import AppCard from "../components/ui/AppCard";             // temporarily unused — recent apps feature inactive
// import NewsCard from "../components/ui/NewsCard";           // temporarily unused — news feature inactive
// import PinnedAlertCard from "../components/ui/PinnedAlertCard"; // temporarily unused — news feature inactive
// import KPIStatCard from "../components/ui/KPIStatCard";     // temporarily unused — KPI feature inactive
// import ProductCard from "../components/ui/ProductCard";    // temporarily unused — store feature inactive

/* ─── Quick action definitions ──────────────────────── */

const quickActions: { icon: string; label: string; page: PageId; color: string; appId?: string; externalUrl?: string }[] = [
  { icon: "📸", label: "FaceApp", page: "hr-hub", color: departmentColors["HR"], appId: "faceapp", externalUrl: "https://apps.powerapps.com/play/e/default-fb94de98-15ae-46be-9699-5eeed956ebd0/a/f5653889-005c-4d77-b2d5-a45618ce0e8e?tenantId=fb94de98-15ae-46be-9699-5eeed956ebd0&hint=dc55b8da-cdcc-4162-bc8e-f808f554768d&sourcetime=1774995559493" },
  { icon: "⏱️", label: "TimeSheet", page: "hr-hub", color: departmentColors["HR"], appId: "timesheet", externalUrl: "https://apps.powerapps.com/play/e/default-fb94de98-15ae-46be-9699-5eeed956ebd0/a/2fd14482-59bd-464a-9815-0f305fb96345?tenantId=fb94de98-15ae-46be-9699-5eeed956ebd0&hint=b899c432-63ce-45ef-9c85-47d6a807bde9&sourcetime=1774995530002" },
  { icon: "💼", label: "Acumatica", page: "hr-hub", color: departmentColors["HR"], appId: "acumatica-panel", externalUrl: "https://momentum.acumatica.com/Frames/Login.aspx?CompanyID=Momentum%20Live" },
  { icon: "🏭", label: "Fab Cart", page: "manufacturing-hub", color: departmentColors["Manufacturing & Production"], appId: "fab-cart", externalUrl: "https://apps.powerapps.com/play/e/default-fb94de98-15ae-46be-9699-5eeed956ebd0/a/b3be4de6-f515-4309-bbf7-17e5d582fcc3?tenantId=fb94de98-15ae-46be-9699-5eeed956ebd0&hint=5f487d34-e729-4b54-9cd4-eb4e97611266&sourcetime=1774995618845" },
  { icon: "📋", label: "MRF", page: "mrf", color: departmentColors["Manufacturing & Production"], appId: "mrf" },
  { icon: "⚠️", label: "NCR", page: "manufacturing-hub", color: departmentColors["Manufacturing & Production"], appId: "ncr" },
];

/* ─── Department shortcuts ──────────────────────────── */

const departments = [
  { icon: "👥", label: "HR", color: departmentColors["HR"], category: "HR" as const, page: "hr-hub" as PageId },
  { icon: "🏭", label: "Manufacturing", color: departmentColors["Manufacturing & Production"], category: "Manufacturing & Production" as const, page: "manufacturing-hub" as PageId },
  { icon: "📐", label: "Engineering", color: departmentColors["Engineering"], category: "Engineering" as const, page: "engineering-hub" as PageId },
  { icon: "🔗", label: "PreCon", color: departmentColors["PreCon"], category: "PreCon" as const, page: "precon-hub" as PageId },
  { icon: "📈", label: "Reports", color: departmentColors["Reports"], category: "Reports" as const, page: "reports-hub" as PageId },
];

/* ─── Greeting helper ───────────────────────────────── */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ─── Component ─────────────────────────────────────── */

interface HomeProps extends NavigablePageProps {
  user: UserProfile;
}

export default function Home({ onNavigate, user }: HomeProps) {
  const { profile } = useUserProfile();
  const apps = useMemo(() => filterAppsByPermission(allApps, profile.appPermissions), [profile.appPermissions]);
  const visibleQuickActions = useMemo(() => quickActions.filter((qa) => !qa.appId || isAppAllowed(qa.appId, profile.appPermissions)), [profile.appPermissions]);
  const firstName = user.name.split(" ")[0];
  // const alertItems = [...urgentNews, ...pinnedNews];  // temporarily unused — news feature inactive
  // const featuredStore = storeItems.filter((s) => s.inStock !== false).slice(0, 3); // temporarily unused — store feature inactive
  void urgentNews; void pinnedNews; // keep imports for future reactivation

  return (
    <div className="mg-page mg-home">
      {/* ── Greeting ─────────────────────────────────── */}
      <section className="home-greeting">
        <div>
          <h2 className="mg-greeting">{getGreeting()}, {firstName} 👋</h2>
          <p className="mg-subtitle">Here's what's happening at Momentum Glass</p>
        </div>
        <div className="home-greeting-badge">
          <span className="home-greeting-dept">{user.department}</span>
        </div>
      </section>

      {/* ── Alerts (urgent + pinned) ─────────────────── */}
      {/* TEMPORARILY HIDDEN — urgent news feature inactive
      {alertItems.length > 0 && (
        <section className="mg-section">
          <div className="home-alerts">
            {alertItems.map((item) => (
              <PinnedAlertCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
      */}

      {/* ── Quick Actions ────────────────────────────── */}
      <section className="mg-section">
        <SectionHeader title="Quick Actions" />
        <div className="home-quick-grid">
          {visibleQuickActions.map((qa) => (
            <QuickActionCard key={qa.label} icon={qa.icon} label={qa.label} color={qa.color} onClick={() => {
              if (qa.externalUrl) {
                openExternalUrl(qa.externalUrl);
              } else {
                onNavigate(qa.page);
              }
            }} />
          ))}
        </div>
      </section>

      {/* ── KPI Stats ────────────────────────────────── */}
      {/* TEMPORARILY HIDDEN — KPI feature inactive
      <section className="mg-section">
        <SectionHeader title="Today's Snapshot" icon="📊" />
        <div className="home-kpi-grid">
          {dashboardStats.map((stat) => (
            <KPIStatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>
      */}

      {/* ── Departments ──────────────────────────────── */}
      <section className="mg-section">
        <SectionHeader title="Departments" action="All apps" onAction={() => onNavigate("apps")} />
        <div className="home-dept-grid">
          {departments.map((d) => (
            <DepartmentShortcutCard
              key={d.category}
              icon={d.icon}
              label={d.label}
              color={d.color}
              appCount={apps.filter((a) => a.category === d.category).length}
              page={d.page}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* ── Recent Apps ──────────────────────────────── */}
      {/* TEMPORARILY HIDDEN — recent apps feature inactive
      <section className="mg-section">
        <SectionHeader title="Recent Apps" icon="🕒" action="See all" onAction={() => onNavigate("apps")} />
        <div className="home-recent-grid">
          {recentApps.slice(0, 4).map((app) => (
            <AppCard key={app.id} app={app} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
      */}

      {/* ── Company News ─────────────────────────────── */}
      {/* TEMPORARILY HIDDEN — news feature inactive
      <section className="mg-section">
        <SectionHeader title="Company News" icon="📰" action="See all" onAction={() => onNavigate("news")} />
        <div className="home-news-grid">
          {newsItems
            .filter((n) => n.urgency === "normal")
            .slice(0, 3)
            .map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
        </div>
      </section>
      */}

      {/* ── Featured Store ───────────────────────────── */}
      {/* TEMPORARILY HIDDEN — store feature inactive
      <section className="mg-section">
        <SectionHeader title="MG Store" icon="🛍️" action="Browse" onAction={() => onNavigate("store")} />
        <div className="home-store-grid">
          {featuredStore.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>
      */}
    </div>
  );
}
