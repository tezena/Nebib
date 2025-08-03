import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : typeof window !== "undefined" && window.location.hostname === "10.77.185.88"
      ? "http://10.77.185.88:3000"
      : typeof window !== "undefined" && window.location.hostname === "nebibs.com"
      ? "https://nebibs.com"
      : typeof window !== "undefined" && window.location.hostname === "www.nebibs.com"
      ? "https://www.nebibs.com"
      : typeof window !== "undefined" && window.location.hostname.includes("amplifyapp.com")
      ? `https://${window.location.hostname}`
      : typeof window !== "undefined" && window.location.hostname.includes("railway.app")
      ? `https://${window.location.hostname}`
      : "https://nebib-production.up.railway.app", // fallback
});
