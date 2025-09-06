import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined" 
      ? (() => {
          const { hostname } = window.location;
          
          if (hostname === "localhost" || hostname === "127.0.0.1") {
            return "http://localhost:3000";
          }
          if (hostname === "10.77.185.88") {
            return "http://10.77.185.88:3000";
          }
          if (hostname === "nebibs.com" || hostname === "www.nebibs.com") {
            return `https://${hostname}`;
          }
          if (hostname.includes("amplifyapp.com") || 
              hostname.includes("railway.app") || 
              hostname.includes("vercel.app") ||
              hostname === "nebib-production-def4.up.railway.app") { // Added Railway URL
            return `https://${hostname}`;
          }
          return "https://nebib-weld.vercel.app"; // Vercel fallback
        })()
      : "https://nebib-weld.vercel.app", // Vercel for server-side
});