import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : typeof window !== "undefined" && window.location.hostname === "10.77.185.88"
      ? "http://10.77.185.88:3000"
      : "https://nebib-production.up.railway.app", // the base url of your auth server
});
