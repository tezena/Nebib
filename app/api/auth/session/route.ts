import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { addCorsHeaders } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ 
      headers: request.headers 
    });
    
    if (!session) {
      const response = NextResponse.json({ user: null }, { status: 401 });
      return addCorsHeaders(response, request);
    }
    
    const response = NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        organizationName: session.user.organizationName,
      }
    });
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("Session API error:", error);
    const response = NextResponse.json({ user: null }, { status: 500 });
    return addCorsHeaders(response, request);
  }
} 