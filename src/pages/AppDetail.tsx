import type { AppItem } from "../types";
import ExternalAppBadge from "../components/ui/ExternalAppBadge";
import { openExternalUrl } from "../utils/openExternal";

interface AppDetailProps {
  app: AppItem;
  onBack: () => void;
}

export default function AppDetail({ app, onBack }: AppDetailProps) {
  const handleLaunch = () => {
    if (app.isExternal && app.externalUrl) {
      openExternalUrl(app.externalUrl);
    }
  };

  return (
    <div className="mg-page app-detail-page">
      {/* ── App identity ──────────────────────────── */}
      <section className="app-detail-header">
        <div className="app-detail-icon" style={{ backgroundColor: app.color }}>
          {app.icon}
        </div>
        <h2 className="app-detail-name">{app.name}</h2>
        <div className="app-detail-badges">
          <span className="app-detail-category">{app.category}</span>
          {app.isExternal && <ExternalAppBadge />}
          {app.isFavorite && <span className="app-detail-fav">★ Favorite</span>}
        </div>
      </section>

      {/* ── Description ───────────────────────────── */}
      {app.description && (
        <section className="app-detail-section">
          <p className="app-detail-desc">{app.description}</p>
        </section>
      )}

      {/* ── External notice ───────────────────────── */}
      {app.isExternal && (
        <div className="app-detail-notice">
          <span className="app-detail-notice-icon">🔗</span>
          <span>This tool opens in another Power App. You will leave the MG Super App.</span>
        </div>
      )}

      {/* ── Actions ───────────────────────────────── */}
      <section className="app-detail-actions">
        {app.isExternal && app.externalUrl ? (
          <button className="app-detail-launch" onClick={handleLaunch}>
            Launch App ↗
          </button>
        ) : (
          <div className="app-detail-notice app-detail-notice--info">
            <span className="app-detail-notice-icon">📱</span>
            <span>This tool is built into the MG Super App.</span>
          </div>
        )}
        <button className="app-detail-back" onClick={onBack}>
          ← Go Back
        </button>
      </section>
    </div>
  );
}
