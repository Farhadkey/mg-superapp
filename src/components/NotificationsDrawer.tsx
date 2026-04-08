import type { NotificationItem, NotificationType } from "../types";

interface NotificationsDrawerProps {
  open: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const typeLabels: Record<NotificationType, string> = {
  "company-news": "Company News",
  "urgent-alert": "Urgent Alert",
  "hr-reminder": "HR Reminder",
  "store-order": "Store Order",
  "app-reminder": "App Reminder",
};

export default function NotificationsDrawer({
  open,
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
}: NotificationsDrawerProps) {
  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`notif-backdrop${open ? " notif-backdrop--open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`notif-drawer${open ? " notif-drawer--open" : ""}`}
        aria-label="Notifications"
        role="dialog"
      >
        {/* Header */}
        <div className="notif-drawer-header">
          <h2 className="notif-drawer-title">
            Notifications
            {unread.length > 0 && (
              <span className="notif-drawer-badge">{unread.length}</span>
            )}
          </h2>
          <div className="notif-drawer-actions">
            {unread.length > 0 && (
              <button className="notif-mark-all" onClick={onMarkAllRead}>
                Mark all read
              </button>
            )}
            <button className="notif-close" onClick={onClose} aria-label="Close notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="notif-drawer-body">
          {notifications.length === 0 && (
            <p className="notif-empty">No notifications</p>
          )}

          {/* Unread */}
          {unread.length > 0 && (
            <section className="notif-group">
              <h3 className="notif-group-title">New</h3>
              {unread.map((n) => (
                <NotifCard key={n.id} item={n} onMarkRead={onMarkRead} />
              ))}
            </section>
          )}

          {/* Read */}
          {read.length > 0 && (
            <section className="notif-group">
              <h3 className="notif-group-title">Earlier</h3>
              {read.map((n) => (
                <NotifCard key={n.id} item={n} onMarkRead={onMarkRead} />
              ))}
            </section>
          )}
        </div>
      </aside>
    </>
  );
}

/* ─── Single notification card ──────────────────── */

function NotifCard({
  item,
  onMarkRead,
}: {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
}) {
  return (
    <button
      className={`notif-card${item.isUrgent ? " notif-card--urgent" : ""}${!item.isRead ? " notif-card--unread" : ""}`}
      onClick={() => !item.isRead && onMarkRead(item.id)}
    >
      <span className="notif-card-icon">{item.icon}</span>
      <div className="notif-card-body">
        <div className="notif-card-row">
          <span className="notif-card-title">{item.title}</span>
          {!item.isRead && <span className="notif-card-dot" />}
        </div>
        <p className="notif-card-text">{item.body}</p>
        <div className="notif-card-meta">
          <span className={`notif-card-type notif-card-type--${item.type}`}>
            {typeLabels[item.type]}
          </span>
          <span className="notif-card-time">{item.time}</span>
        </div>
      </div>
    </button>
  );
}
