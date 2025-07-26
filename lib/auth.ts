import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "VLXuel6RHytCGP2FA3fUPBY4Eu8vkvfb",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      organizationName: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  
  trustedOrigins: [
    "https://nebib-forms-production.up.railway.app",
    "https://nebib-forms-production-c7f6.up.railway.app",
    "https://nebib-production.up.railway.app",
    "https://www.nebibs.com",
    "https://nebibs.com",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
});
