import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import type { PageId, AppItem, UserProfile } from "./types";
import { notifications, currentUser as defaultUser } from "./data/mockData";
import { openExternalUrl } from "./utils/openExternal";
import { UserProfileProvider, useUserProfile } from "./context/UserProfileContext";
import AppShell from "./components/Layout/AppShell";
import NotificationsDrawer from "./components/NotificationsDrawer";
import Home from "./pages/Home";
import AppsLauncher from "./pages/AppsLauncher";
import NewsCenter from "./pages/NewsCenter";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import HRHub from "./pages/HRHub";
import ManufacturingHub from "./pages/ManufacturingHub";
import EngineeringHub from "./pages/EngineeringHub";
import PreConHub from "./pages/PreConHub";
import ReportsHub from "./pages/ReportsHub";
import AppDetail from "./pages/AppDetail";
import SearchResults from "./pages/SearchResults";
import MRFApp from "./pages/MRFApp";
import "./App.css";

const pageTitles: Record<PageId, string> = {
  home: "Momentum Glass",
  apps: "Apps",
  news: "News Center",
  store: "Store",
  profile: "Profile",
  "hr-hub": "HR Hub",
  "manufacturing-hub": "Manufacturing Hub",
  "engineering-hub": "Engineering Hub",
  "precon-hub": "PreCon Hub",
  "reports-hub": "Reports Hub",
  "app-detail": "App Details",
  search: "Search",
  mrf: "Material Request Form",
};

const hubPages: PageId[] = [
  "hr-hub",
  "manufacturing-hub",
  "engineering-hub",
  "precon-hub",
  "reports-hub",
  "app-detail",
  "search",
  "mrf",
];

function AppContent() {
  const { profile, profileLoaded, profileLoading } = useUserProfile();
  const [page, setPage] = useState<PageId>("home");
  const [prevPage, setPrevPage] = useState<PageId>("home");
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [_drawerOpen, setDrawerOpen] = useState(false); // temporarily unused — notifications feature inactive
  void _drawerOpen;
  const [notifs, setNotifs] = useState(notifications);
  const [mrfCode, setMrfCode] = useState<string | null>(null);

  useEffect(() => {
    // Extract MRFCode from URL query params (replaces Power Apps context)
    const params = new URLSearchParams(window.location.search);
    const code = params.get("MRFCode");
    if (code) {
      setMrfCode(code);
      setPage("mrf");
    }
  }, []);

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const internalAppPages: PageId[] = ["mrf"];

  const navigate = (target: PageId, app?: AppItem) => {
    // External apps: open URL directly (Power Apps mobile on mobile devices)
    if (app?.isExternal && app.externalUrl) {
      openExternalUrl(app.externalUrl);
      return;
    }
    if (app) {
      if (internalAppPages.includes(app.page)) {
        setPrevPage(page);
        setPage(app.page);
        return;
      }
      setSelectedApp(app);
      setPrevPage(page);
      setPage("app-detail");
      return;
    }
    setPrevPage(page);
    setPage(target);
  };

  const goBack = () => {
    setPage(prevPage);
  };

  const isHub = hubPages.includes(page);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home onNavigate={navigate} user={profile} />;
      case "apps":
        return <AppsLauncher onNavigate={navigate} />;
      case "news":
        return <NewsCenter />;
      case "store":
        return <Store />;
      case "profile":
        return <Profile onNavigate={navigate} user={profile} />;
      case "hr-hub":
        return <HRHub onNavigate={navigate} />;
      case "manufacturing-hub":
        return <ManufacturingHub onNavigate={navigate} />;
      case "engineering-hub":
        return <EngineeringHub onNavigate={navigate} />;
      case "precon-hub":
        return <PreConHub onNavigate={navigate} />;
      case "reports-hub":
        return <ReportsHub onNavigate={navigate} />;
      case "app-detail":
        return selectedApp ? <AppDetail app={selectedApp} onBack={goBack} /> : null;
      case "search":
        return <SearchResults onNavigate={navigate} />;
      case "mrf":
        return <MRFApp userEmail={profile.email} userName={profile.name} mrfCode={mrfCode} />;
    }
  };

  // Show full-page loader until profile & permissions are fetched
  if (!profileLoaded || profileLoading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-spinner" />
        <p className="app-loading-text">Loading your workspace…</p>
      </div>
    );
  }

  return (
    <>
    <AppShell
      activePage={page}
      title={page === "app-detail" && selectedApp ? selectedApp.name : pageTitles[page]}
      showBack={isHub}
      onBack={goBack}
      onNavigate={navigate}
      onSearchClick={() => navigate("search")}
      onNotificationsClick={() => setDrawerOpen(true)}
      unreadCount={unreadCount}
      userInitials={profile.avatar}
    >
      {renderPage()}
    </AppShell>
    <NotificationsDrawer
      open={false /* TEMPORARILY DISABLED — notifications feature inactive */}
      notifications={notifs}
      onClose={() => setDrawerOpen(false)}
      onMarkRead={markRead}
      onMarkAllRead={markAllRead}
    />
    </>
  );
}

function App() {
  const { accounts } = useMsal();
  const [user, setUser] = useState<UserProfile>({ ...defaultUser, email: "" });

  useEffect(() => {
    const account = accounts[0];
    if (account) {
      const fullName = account.name || defaultUser.name;
      const email = account.username || defaultUser.email;
      const initials = fullName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      setUser((prev) => ({ ...prev, name: fullName, email, avatar: initials }));
    } else {
      // No account yet (pre-login or local dev)
      setUser((prev) => ({ ...prev, email: defaultUser.email }));
    }
  }, [accounts]);

  return (
    <UserProfileProvider defaultUser={user}>
      <AppContent />
    </UserProfileProvider>
  );
}

export default App;
