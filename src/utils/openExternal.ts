const POWERAPPS_HOST = "https://apps.powerapps.com/";

function isMobileDevice(): boolean {
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return true;
  // iPad on iOS 13+ reports as desktop Mac
  return navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent);
}

function buildDeepLink(url: string): string | null {
  const match = url.match(/\/a(?:pp)?\/([0-9a-f-]{36})/i);
  if (!match) return null;
  const src = new URL(url).searchParams;
  const params = new URLSearchParams();
  if (src.get("tenantId")) params.set("tenantId", src.get("tenantId")!);
  if (src.get("hint")) params.set("hint", src.get("hint")!);
  if (src.get("sourcetime")) params.set("sourcetime", src.get("sourcetime")!);
  params.set("appType", "CanvasApp");
  return `ms-apps:///providers/Microsoft.PowerApps/apps/${match[1]}?${params}`;
}

/**
 * Opens an external URL in a new tab.
 * On mobile, uses the ms-apps:// deep link so the Power Apps mobile app opens.
 * On desktop, opens the web URL in a new browser tab.
 */
export function openExternalUrl(url: string): void {
  if (isMobileDevice() && url.startsWith(POWERAPPS_HOST)) {
    const deepLink = buildDeepLink(url);
    if (deepLink) {
      window.open(deepLink, "_blank", "noopener");
      return;
    }
  }
  window.open(url, "_blank", "noopener");
}
