import { NextResponse, NextRequest } from "next/server";
import { addCorsHeaders } from "@/lib/cors";
import { db } from "@/lib/db";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: NextRequest) => {
  try {
    console.log("🔍 Debug API: Starting request");
    
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "SET" : "NOT SET",
      DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET",
      HOSTNAME: request.headers.get('host'),
      ORIGIN: request.headers.get('origin'),
      USER_AGENT: request.headers.get('user-agent'),
    };

    // Test database connection
    let dbStatus = "UNKNOWN";
    try {
      await db.$queryRaw`SELECT 1`;
      dbStatus = "CONNECTED";
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      dbStatus = "ERROR: " + (dbError instanceof Error ? dbError.message : "Unknown error");
    }

    // Check auth configuration
    const authCheck = {
      secret: process.env.BETTER_AUTH_SECRET ? "CONFIGURED" : "MISSING",
      database: dbStatus,
    };

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      auth: authCheck,
      server: {
        nodeVersion: process.version,
        platform: process.platform,
      }
    };

    console.log("🔍 Debug API: Returning debug info", debugInfo);

    const response = NextResponse.json(debugInfo);
    return addCorsHeaders(response, request);

  } catch (error) {
    console.error("Debug API error:", error);
    const response = NextResponse.json(
      { 
        error: "Debug endpoint failed", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
}; 