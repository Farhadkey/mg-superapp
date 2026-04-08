import type { PageId } from "../../types";
import { navItems } from "../../data/navigation";

interface BottomNavProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export default function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <nav className="mg-bottom-nav">
      {navItems.map((tab) => (
        <button
          key={tab.id}
          className={`mg-bottom-nav-tab${activePage === tab.id ? " active" : ""}${tab.disabled ? " mg-bottom-nav-tab--disabled" : ""}`}
          onClick={() => !tab.disabled && onNavigate(tab.id)}
          aria-label={tab.label}
          aria-current={activePage === tab.id ? "page" : undefined}
          aria-disabled={tab.disabled || undefined}
          style={tab.disabled ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
        >
          <span className="mg-bottom-nav-icon">{tab.icon}</span>
          <span className="mg-bottom-nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
