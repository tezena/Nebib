import { NextRequest, NextResponse } from "next/server";
import { addCorsHeaders } from "@/lib/cors";
import { auth } from "@/lib/auth";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const POST = async (request: NextRequest) => {
  try {
    const { POST: originalPost } = await import("better-auth/next-js").then(m => m.toNextJsHandler(auth));
    const response = await originalPost(request);
    
    // Convert Response to NextResponse for CORS
    const nextResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    
    return addCorsHeaders(nextResponse, request);
  } catch (error) {
    console.error("Sign-in error:", error);
    const errorResponse = NextResponse.json(
      { error: "Sign-in failed" },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse, request);
  }
}; 