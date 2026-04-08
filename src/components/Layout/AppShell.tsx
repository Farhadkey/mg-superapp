import { type ReactNode, useState, useCallback } from "react";
import type { PageId } from "../../types";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

interface AppShellProps {
  activePage: PageId;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onNavigate: (page: PageId) => void;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  unreadCount?: number;
  userInitials?: string;
  children: ReactNode;
}

export default function AppShell({
  activePage,
  title,
  showBack,
  onBack,
  onNavigate,
  onSearchClick,
  onNotificationsClick,
  unreadCount,
  userInitials,
  children,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((prev) => !prev), []);

  return (
    <div className="mg-app-shell">
      <Header title={title} showBack={showBack} onBack={onBack} onSearchClick={onSearchClick} onNotificationsClick={onNotificationsClick} unreadCount={unreadCount} userInitials={userInitials} />
      <div className="mg-body">
        <Sidebar activePage={activePage} onNavigate={onNavigate} collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <main className="mg-content">{children}</main>
      </div>
      <BottomNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  );
}
