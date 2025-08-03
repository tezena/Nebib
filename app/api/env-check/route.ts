import { NextResponse, NextRequest } from "next/server";
import { addCorsHeaders } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: NextRequest) => {
  try {
    console.log("🔍 Environment Check API: Starting request");
    
    const envInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "SET" : "NOT SET",
        DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET",
        AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "NOT SET",
      },
      request: {
        hostname: request.headers.get('host'),
        origin: request.headers.get('origin'),
        userAgent: request.headers.get('user-agent'),
      },
      server: {
        nodeVersion: process.version,
        platform: process.platform,
      }
    };

    console.log("🔍 Environment Check API: Returning info", envInfo);

    const response = NextResponse.json(envInfo);
    return addCorsHeaders(response, request);

  } catch (error) {
    console.error("Environment Check API error:", error);
    const response = NextResponse.json(
      { 
        error: "Environment check failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
}; 