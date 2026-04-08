import type { PageId } from "../../types";
import { navItems } from "../../data/navigation";

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`mg-sidebar${collapsed ? " mg-sidebar--collapsed" : ""}`}>
      <button
        className="mg-sidebar-toggle"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand menu" : "Collapse menu"}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          {collapsed ? (
            <path d="M6 4L12 9L6 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          ) : (
            <path d="M12 4L6 9L12 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          )}
        </svg>
      </button>
      <nav className="mg-sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`mg-sidebar-item${activePage === item.id ? " active" : ""}${item.disabled ? " mg-sidebar-item--disabled" : ""}`}
            onClick={() => !item.disabled && onNavigate(item.id)}
            aria-label={item.label}
            aria-current={activePage === item.id ? "page" : undefined}
            aria-disabled={item.disabled || undefined}
            title={item.disabled ? `${item.label} (coming soon)` : collapsed ? item.label : undefined}
            style={item.disabled ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
          >
            <span className="mg-sidebar-icon">{item.icon}</span>
            <span className="mg-sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mg-sidebar-footer">
        <div className="mg-sidebar-divider" />
        <div className="mg-sidebar-company">
          <span className="mg-sidebar-company-icon">🏭</span>
          <div className="mg-sidebar-company-info">
            <span className="mg-sidebar-company-name">Momentum Glass</span>
            <span className="mg-sidebar-company-sub">Manufacturing Co.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
