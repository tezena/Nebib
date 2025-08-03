import { NextRequest, NextResponse } from "next/server";
import { addCorsHeaders } from "@/lib/cors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const POST = async (request: NextRequest) => {
  try {
    console.log("🔐 Custom Sign-in API: Starting request");
    console.log("🔐 Request URL:", request.url);
    console.log("🔐 Request method:", request.method);
    console.log("🔐 Request headers:", Object.fromEntries(request.headers.entries()));
    
    // Check environment variables
    console.log("🔐 Environment check:");
    console.log("  - NODE_ENV:", process.env.NODE_ENV);
    console.log("  - BETTER_AUTH_SECRET:", process.env.BETTER_AUTH_SECRET ? "SET" : "NOT SET");
    console.log("  - DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");
    
    // Test database connection
    console.log("🔐 Testing database connection...");
    try {
      await db.$queryRaw`SELECT 1`;
      console.log("✅ Database connection successful");
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
      throw new Error(`Database connection failed: ${dbError instanceof Error ? dbError.message : "Unknown error"}`);
    }
    
    // Parse request body
    const body = await request.json();
    console.log("🔐 Request body:", body);
    
    // Check auth configuration
    console.log("🔐 Auth configuration check:");
    console.log("  - Auth object:", typeof auth);
    console.log("  - Auth methods:", Object.keys(auth));
    
    // Use the original auth handler
    const { POST: originalPost } = await import("better-auth/next-js").then(m => m.toNextJsHandler(auth));
    
    console.log("🔐 Calling original auth handler...");
    const response = await originalPost(request);
    
    console.log("🔐 Auth handler response:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    // Convert Response to NextResponse for CORS
    const nextResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    
    return addCorsHeaders(nextResponse, request);
    
  } catch (error) {
    console.error("🚨 Custom Sign-in API error:", error);
    console.error("🚨 Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    const errorResponse = NextResponse.json(
      { 
        error: "Sign-in failed", 
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        debug: {
          nodeEnv: process.env.NODE_ENV,
          hasAuthSecret: !!process.env.BETTER_AUTH_SECRET,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
        }
      },
      { status: 500 }
    );
    
    return addCorsHeaders(errorResponse, request);
  }
}; 