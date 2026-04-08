import { PublicClientApplication, type Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: "828d9c1d-6eb2-408a-bae3-f1145d7ddd8d",
    authority: "https://login.microsoftonline.com/fb94de98-15ae-46be-9699-5eeed956ebd0",
    redirectUri: window.location.origin + "/",
  },
  cache: {
    cacheLocation: "localStorage",
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Scope needed to call Power Automate HTTP triggers
export const flowScopes = ["https://service.flow.microsoft.com/.default"];

/**
 * Acquire a token silently (or via popup if needed).
 * Returns the Bearer token string.
 */
export async function getFlowToken(): Promise<string> {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    // No cached account — trigger interactive login
    const result = await msalInstance.loginPopup({ scopes: flowScopes });
    return result.accessToken;
  }
  try {
    const result = await msalInstance.acquireTokenSilent({
      scopes: flowScopes,
      account: accounts[0],
    });
    return result.accessToken;
  } catch {
    // Silent failed — fall back to popup
    const result = await msalInstance.acquireTokenPopup({ scopes: flowScopes });
    return result.accessToken;
  }
}
