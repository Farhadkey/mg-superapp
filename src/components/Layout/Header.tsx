import logoSvg from "../../assets/MomLogo_header.svg";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  unreadCount?: number;
  userInitials?: string;
}

export default function Header({ title, onBack, showBack, onSearchClick, onNotificationsClick: _onNotificationsClick, unreadCount: _unreadCount = 0, userInitials = "MG" }: HeaderProps) {
  return (
    <header className="mg-header">
      <div className="mg-header-inner">
        {/* Left: Back button or Logo */}
        <div className="mg-header-left">
          {showBack ? (
            <button className="mg-header-back" onClick={onBack} aria-label="Go back">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 16L7 10L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <div className="mg-header-brand">
              <img src={logoSvg} alt="Momentum Glass" className="mg-header-logo-img" />
              <span className="mg-header-brand-name">Momentum Glass</span>
            </div>
          )}
        </div>

        {/* Center: Search (desktop) / Title (mobile when navigating back) */}
        {showBack ? (
          <h1 className="mg-header-title">{title}</h1>
        ) : (
          <div className="mg-header-search">
            <svg className="mg-header-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="mg-header-search-input"
              placeholder="Search apps, people, docs..."
              aria-label="Search"
              readOnly
              onClick={onSearchClick}
              style={{ cursor: "pointer" }}
            />
          </div>
        )}

        {/* Right: Actions */}
        <div className="mg-header-actions">
          {/* TEMPORARILY HIDDEN — notifications feature inactive
          <button className="mg-header-action" aria-label="Notifications" onClick={onNotificationsClick}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C7.24 2 5 4.24 5 7V10.5L3.5 13H16.5L15 10.5V7C15 4.24 12.76 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 14C8 15.1 8.9 16 10 16C11.1 16 12 15.1 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {unreadCount > 0 && <span className="mg-header-notif-dot" />}
          </button>
          */}
          <button className="mg-header-avatar" aria-label="User profile">
            {userInitials}
          </button>
        </div>
      </div>
    </header>
  );
}
