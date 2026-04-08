import type { AppItem, PageId } from "../../types";
import ExternalAppBadge from "./ExternalAppBadge";
import { openExternalUrl } from "../../utils/openExternal";

interface AppCardProps {
  app: AppItem;
  onNavigate?: (page: PageId, app?: AppItem) => void;
}

export default function AppCard({ app, onNavigate }: AppCardProps) {
  const handleClick = () => {
    if (app.isExternal && app.externalUrl) {
      openExternalUrl(app.externalUrl);
      return;
    }
    onNavigate?.(app.page, app);
  };

  return (
    <button className="ui-app-card" onClick={handleClick}>
      <div className="ui-app-card-icon" style={{ backgroundColor: app.color }}>
        {app.icon}
      </div>
      <div className="ui-app-card-info">
        <div className="ui-app-card-name-row">
          <span className="ui-app-card-name">{app.name}</span>
          {app.isExternal && <ExternalAppBadge />}
        </div>
        {app.description && (
          <span className="ui-app-card-desc">{app.description}</span>
        )}
      </div>
    </button>
  );
}
