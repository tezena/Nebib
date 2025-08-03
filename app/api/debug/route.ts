import { NextResponse, NextRequest } from "next/server";
import { addCorsHeaders } from "@/lib/cors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: NextRequest) => {
  try {
    console.log("🔍 Debug API: Starting request");
    
    // Test database connection
    let dbStatus = "UNKNOWN";
    try {
      await db.$queryRaw`SELECT 1`;
      dbStatus = "CONNECTED";
    } catch (error) {
      dbStatus = "ERROR: " + (error instanceof Error ? error.message : "Unknown error");
    }

    // Test auth configuration
    let authSecret = "MISSING";
    if (process.env.BETTER_AUTH_SECRET) {
      authSecret = "SET";
    }
    
    // Check all possible auth-related environment variables
    const allEnvVars = Object.keys(process.env).filter(key => 
      key.includes('AUTH') || key.includes('SECRET')
    ).reduce((acc, key) => {
      acc[key] = process.env[key] ? "SET" : "NOT SET";
      return acc;
    }, {} as Record<string, string>);

    const debugInfo = {
      timestamp: new Date().toISOString(),
      buildTrigger: "2025-08-03T17:40:00Z", // Force rebuild
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "SET" : "NOT SET",
        DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET",
        HOSTNAME: request.headers.get('host'),
        ORIGIN: request.headers.get('origin'),
        USER_AGENT: request.headers.get('user-agent'),
      },
      auth: {
        secret: authSecret,
        database: dbStatus,
        allAuthVars: allEnvVars,
      },
      server: {
        nodeVersion: process.version,
        platform: process.platform,
      }
    };

    console.log("🔍 Debug API: Returning info", debugInfo);

    const response = NextResponse.json(debugInfo);
    return addCorsHeaders(response, request);

  } catch (error) {
    console.error("Debug API error:", error);
    const response = NextResponse.json(
      { 
        error: "Debug failed", 
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
}; 