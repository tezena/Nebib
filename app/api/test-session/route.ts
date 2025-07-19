import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

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
    
    return NextResponse.json({
      hasSession: !!session,
      user: session ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      } : null,
      cookies: request.headers.get("cookie")
    });
  } catch (error) {
    console.error("🚨 Test Session API Error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      hasSession: false
    });
  }
} 