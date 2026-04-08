import type { NewsItem } from "../../types";

interface PinnedAlertCardProps {
  item: NewsItem;
  onClick?: () => void;
}

export default function PinnedAlertCard({ item, onClick }: PinnedAlertCardProps) {
  const isUrgent = item.urgency === "urgent";

  return (
    <button
      className={`ui-alert-card ${isUrgent ? "ui-alert-card--urgent" : "ui-alert-card--pinned"}`}
      onClick={onClick}
    >
      <div className="ui-alert-card-indicator" />
      <div className="ui-alert-card-content">
        <div className="ui-alert-card-top">
          <span className={`ui-alert-card-tag ${isUrgent ? "ui-alert-card-tag--urgent" : "ui-alert-card-tag--pinned"}`}>
            {isUrgent ? "⚠ Urgent" : "📌 Pinned"}
          </span>
          <span className="ui-alert-card-date">{item.date}</span>
        </div>
        <h4 className="ui-alert-card-title">{item.title}</h4>
        <p className="ui-alert-card-summary">{item.summary}</p>
      </div>
    </button>
  );
}
