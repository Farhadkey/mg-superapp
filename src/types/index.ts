// ─── App Hub Categories ─────────────────────────────

export type AppCategory =
  | "HR"
  | "Manufacturing & Production"
  | "Engineering"
  | "PreCon"
  | "Reports";

export type PageId =
  | "home"
  | "apps"
  | "news"
  | "store"
  | "profile"
  | "hr-hub"
  | "manufacturing-hub"
  | "engineering-hub"
  | "precon-hub"
  | "reports-hub"
  | "app-detail"
  | "search"
  | "mrf";

// ─── Shared Props ───────────────────────────────────

export interface NavigablePageProps {
  onNavigate: (page: PageId, app?: AppItem) => void;
}

// ─── Quick Links (hub pages) ────────────────────────

export interface QuickLink {
  icon: string;
  label: string;
  detail: string;
}

// ─── App Items ──────────────────────────────────────

export interface AppItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  page: PageId;
  category: AppCategory;
  description?: string;
  /** True if this app opens an external Power Apps link */
  isExternal?: boolean;
  externalUrl?: string;
  /** True if user has marked this app as a favorite */
  isFavorite?: boolean;
}

// ─── News ───────────────────────────────────────────

export type NewsUrgency = "normal" | "urgent" | "pinned";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  imageUrl?: string;
  urgency: NewsUrgency;
  author?: string;
  isRead?: boolean;
}

// ─── App Permissions ────────────────────────────────

export interface AppPermissions {
  App_TimeSheet: boolean;
  App_FaceApp: boolean;
  App_Accumatica: boolean;
  App_FabricationCart: boolean;
  App_MRF: boolean;
  App_NCR: boolean;
  App_Cutlist: boolean;
  App_BimAndDrafting: boolean;
  App_ProjectManagement: boolean;
  App_Pipeline: boolean;
  App_BidSmart: boolean;
  App_SOV: boolean;
  App_ProjectReport: boolean;
  App_HRReport: boolean;
}

// ─── User Profile ───────────────────────────────────

export interface UserProfile {
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
  phone?: string;
  location?: string;
  manager?: string;
  hireDate?: string;
  employeeId?: string;
  employeeCode?: string;
  appPermissions?: AppPermissions;
}

// ─── Store ──────────────────────────────────────────

export type StoreCategory = "Apparel" | "PPE" | "Merch" | "Office" | "Tools";

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: StoreCategory;
  price?: string;
  inStock?: boolean;
  isFeatured?: boolean;
}

// ─── Dashboard / Reports ────────────────────────────

export interface StatCard {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
}

export interface ReportSummary {
  id: string;
  title: string;
  description: string;
  category: AppCategory;
  lastUpdated: string;
  icon: string;
  status: "current" | "outdated" | "generating";
}

// ─── Notifications ──────────────────────────────────

export type NotificationType =
  | "company-news"
  | "urgent-alert"
  | "hr-reminder"
  | "store-order"
  | "app-reminder";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  icon: string;
  isRead: boolean;
  isUrgent?: boolean;
}
