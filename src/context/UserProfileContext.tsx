import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { UserProfile, AppPermissions } from "../types";

const PROFILE_API_URL =
  "https://5f6ab8fb609ce44498e7b1f3eba563.0c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/bece0039008a4652b04b62ca2c86fa48/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ad9aOgEIYQEG0G_RbXXRdSemkyf8vP0VYfPMYyy7Dig";

interface UserProfileContextValue {
  profile: UserProfile;
  profileLoaded: boolean;
  profileLoading: boolean;
  fetchProfile: (email: string) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}

function parseAppPermissions(data: Record<string, unknown>): AppPermissions {
  const keys: (keyof AppPermissions)[] = [
    "App_TimeSheet",
    "App_FaceApp",
    "App_Accumatica",
    "App_FabricationCart",
    "App_MRF",
    "App_NCR",
    "App_Cutlist",
    "App_BimAndDrafting",
    "App_ProjectManagement",
    "App_Pipeline",
    "App_BidSmart",
    "App_SOV",
    "App_ProjectReport",
    "App_HRReport",
  ];
  const perms = {} as AppPermissions;
  for (const key of keys) {
    perms[key] = data[key] === true || data[key] === "Yes";
  }
  return perms;
}

interface UserProfileProviderProps {
  children: ReactNode;
  defaultUser: UserProfile;
}

export function UserProfileProvider({ children, defaultUser }: UserProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile>(defaultUser);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfile = useCallback(async (email: string) => {
    if (!email) return;
    setProfileLoading(true);
    try {
      const res = await fetch(PROFILE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserEmail: email }),
      });
      if (!res.ok) throw new Error(`Profile API error: ${res.status}`);
      const data = await res.json();

      const managerField = data.Manager;
      const managerName =
        typeof managerField === "object" && managerField !== null
          ? managerField.DisplayName || managerField.Email || ""
          : String(managerField || "");

      const employeeField = data.Employee;
      const employeeName =
        typeof employeeField === "object" && employeeField !== null
          ? employeeField.DisplayName || employeeField.Email || ""
          : String(employeeField || "");

      setProfile((prev) => ({
        ...prev,
        name: employeeName || prev.name,
        department: data.Department || prev.department,
        manager: managerName || prev.manager,
        employeeCode: data.EmployeeCode || prev.employeeCode,
        phone: data.MainPhone || prev.phone,
        appPermissions: parseAppPermissions(data),
      }));
      setProfileLoaded(true);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Sync default user changes (name/email set from Power Apps context)
  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      name: defaultUser.name,
      email: defaultUser.email,
      avatar: defaultUser.avatar,
    }));
  }, [defaultUser.name, defaultUser.email, defaultUser.avatar]);

  // Fetch profile once when email is available and not yet loaded
  useEffect(() => {
    if (defaultUser.email && !profileLoaded && !profileLoading) {
      fetchProfile(defaultUser.email);
    }
  }, [defaultUser.email, profileLoaded, profileLoading, fetchProfile]);

  return (
    <UserProfileContext.Provider value={{ profile, profileLoaded, profileLoading, fetchProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}
