import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import type { NavigablePageProps, UserProfile } from "../types";
// import { favoriteApps, recentApps } from "../data/mockData"; // temporarily unused
import SectionHeader from "../components/ui/SectionHeader";
// import AppCard from "../components/ui/AppCard"; // temporarily unused

interface NotifSetting {
  label: string;
  key: string;
  defaultOn: boolean;
}

const notifSettings: NotifSetting[] = [
  { label: "Company News", key: "news", defaultOn: true },
  { label: "Safety Alerts", key: "safety", defaultOn: true },
  { label: "HR Updates", key: "hr", defaultOn: true },
  { label: "Store Promotions", key: "store", defaultOn: false },
];

// temporarily unused — store/orders feature inactive
// const orderHistory = [
//   { id: "o1", item: "MG T-Shirt", date: "Mar 8, 2026", status: "Delivered" },
//   { id: "o2", item: "Safety Glasses", date: "Feb 21, 2026", status: "Delivered" },
//   { id: "o3", item: "MG Water Bottle", date: "Feb 10, 2026", status: "Delivered" },
// ];

const supportLinks = [
  { icon: "📧", label: "Email IT Support", detail: "Timesheet.Support@momentum-glass.com" },
  // { icon: "📞", label: "Help Desk", detail: "Ext. 4100" },              // temporarily hidden
  // { icon: "📖", label: "Employee Handbook", detail: "View PDF" },       // temporarily hidden
  // { icon: "🛡️", label: "Safety Resources", detail: "View" },           // temporarily hidden
];

interface ProfileProps extends NavigablePageProps {
  user: UserProfile;
}

export default function Profile({ onNavigate: _onNavigate, user }: ProfileProps) {
  const { instance } = useMsal();
  // temporarily unused — notifications feature inactive
  const [_notifs] = useState<Record<string, boolean>>(
    Object.fromEntries(notifSettings.map((n) => [n.key, n.defaultOn])),
  );
  void _notifs;

  // const toggleNotif = (key: string) =>
  //   setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="mg-page profile-page">
      {/* ── User card ────────────────────────────── */}
      <section className="profile-user-card">
        <div className="profile-avatar">{user.avatar}</div>
        <div className="profile-user-info">
          <h2 className="profile-name">{user.name}</h2>
        </div>
        <div className="profile-details">
          <div className="profile-row">
            <span className="profile-label">Department</span>
            <span>{user.department}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value-sm">{user.email}</span>
          </div>
          {user.manager && (
            <div className="profile-row">
              <span className="profile-label">Manager</span>
              <span>{user.manager}</span>
            </div>
          )}
          {user.employeeCode && (
            <div className="profile-row">
              <span className="profile-label">Employee Code</span>
              <span>{user.employeeCode}</span>
            </div>
          )}
        </div>
      </section>

      {/* ── Favorite apps ────────────────────────── */}
      {/* TEMPORARILY HIDDEN — feature inactive
      <section className="mg-section">
        <SectionHeader title="Favorite Apps" icon="⭐" />
        <div className="profile-apps-list">
          {favoriteApps.slice(0, 4).map((app) => (
            <AppCard key={app.id} app={app} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
      */}

      {/* ── Recent apps ──────────────────────── */}
      {/* TEMPORARILY HIDDEN — feature inactive
      <section className="mg-section">
        <SectionHeader title="Recent Apps" icon="🕑" />
        <div className="profile-apps-list">
          {recentApps.slice(0, 4).map((app) => (
            <AppCard key={app.id} app={app} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
      */}

      {/* ── Notification settings ────────────────── */}
      {/* TEMPORARILY HIDDEN — notifications feature inactive
      <section className="mg-section">
        <SectionHeader title="Notifications" icon="🔔" />
        <div className="profile-notif-card">
          {notifSettings.map((s) => (
            <div key={s.key} className="profile-notif-row">
              <span className="profile-notif-label">{s.label}</span>
              <button
                className={`profile-toggle ${notifs[s.key] ? "profile-toggle--on" : ""}`}
                onClick={() => toggleNotif(s.key)}
                aria-pressed={notifs[s.key]}
                aria-label={`Toggle ${s.label}`}
              >
                <span className="profile-toggle-thumb" />
              </button>
            </div>
          ))}
        </div>
      </section>
      */}

      {/* ── Order history ────────────────────────── */}
      {/* TEMPORARILY HIDDEN — store/orders feature inactive
      <section className="mg-section">
        <SectionHeader title="Order History" icon="📦" />
        <div className="profile-orders-card">
          {orderHistory.map((o) => (
            <div key={o.id} className="profile-order-row">
              <span className="profile-order-item">{o.item}</span>
              <span className="profile-order-date">{o.date}</span>
              <span className="profile-order-status">{o.status}</span>
            </div>
          ))}
        </div>
      </section>
      */}

      {/* ── Support & Help ───────────────────────── */}
      <section className="mg-section">
        <SectionHeader title="Support & Help" icon="💬" />
        <div className="profile-support-list">
          {supportLinks.map((l) => (
            <div key={l.label} className="profile-support-row">
              <span className="profile-support-icon">{l.icon}</span>
              <span className="profile-support-label">{l.label}</span>
              <span className="profile-support-detail">{l.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sign Out ─────────────────────────────── */}
      <section className="mg-section" style={{ textAlign: "center", paddingBottom: 32 }}>
        <button
          onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: "/" })}
          style={{
            padding: "12px 40px",
            fontSize: 16,
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            background: "#d32f2f",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
            maxWidth: 320,
          }}
        >
          Sign Out
        </button>
      </section>
    </div>
  );
}
