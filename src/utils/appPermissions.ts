import type { AppPermissions, AppItem } from "../types";

const appIdToPermissionKey: Record<string, keyof AppPermissions> = {
  timesheet: "App_TimeSheet",
  faceapp: "App_FaceApp",
  "acumatica-panel": "App_Accumatica",
  "fab-cart": "App_FabricationCart",
  mrf: "App_MRF",
  ncr: "App_NCR",
  "cutlist-scheduler": "App_Cutlist",
  "bim-tracker": "App_BimAndDrafting",
  "project-mgmt": "App_ProjectManagement",
  pipeline: "App_Pipeline",
  "bid-smartsheet": "App_BidSmart",
  "sov-tools": "App_SOV",
  "project-reports": "App_ProjectReport",
  "hr-reports": "App_HRReport",
};

export function filterAppsByPermission(
  apps: AppItem[],
  permissions: AppPermissions | undefined,
): AppItem[] {
  // If permissions haven't loaded yet, show all apps
  if (!permissions) return apps;
  return apps.filter((app) => {
    const key = appIdToPermissionKey[app.id];
    // If no permission key mapped, show the app by default
    if (!key) return true;
    return permissions[key];
  });
}

/** Check whether a single app ID is allowed by permissions. */
export function isAppAllowed(appId: string, permissions: AppPermissions | undefined): boolean {
  if (!permissions) return true;
  const key = appIdToPermissionKey[appId];
  if (!key) return true;
  return permissions[key];
}
