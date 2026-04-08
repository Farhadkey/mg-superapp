import type { PageId } from "../types";

export interface NavItem {
  id: PageId;
  label: string;
  icon: string;
  disabled?: boolean; // feature temporarily inactive
}

export const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "apps", label: "Apps", icon: "⊞" },
  { id: "news", label: "News", icon: "📰", disabled: true },   // temporarily inactive
  { id: "store", label: "Store", icon: "🛒", disabled: true },  // temporarily inactive
  { id: "profile", label: "Profile", icon: "👤" },
];
