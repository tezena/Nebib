import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "https://nebibforms.vercel.app", // the base url of your auth server
});
