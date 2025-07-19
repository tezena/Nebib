import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { addCorsHeaders } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Test Session API: Starting...");
    console.log("🍪 Test Session API: Cookies:", request.headers.get("cookie"));
    
    const session = await auth.api.getSession({ 
      headers: request.headers 
    });
    
    console.log("📋 Test Session API: Session found:", !!session);
    if (session) {
      console.log("👤 Test Session API: User ID:", session.user.id);
      console.log("📧 Test Session API: User email:", session.user.email);
    }
    
    const response = NextResponse.json({
      hasSession: !!session,
      user: session ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      } : null,
      cookies: request.headers.get("cookie")
    });
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 Test Session API Error:", error);
    const response = NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      hasSession: false
    });
    return addCorsHeaders(response, request);
  }
} 