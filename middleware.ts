import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  try {
    console.log("🔍 Middleware: Checking session for URL:", request.url);
    console.log("🍪 Middleware: All cookies:", request.headers.get("cookie"));
    
    // Check for better-auth specific cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    console.log("🍪 Middleware: Parsed cookies:", Object.keys(cookies));
    console.log("🍪 Middleware: Better-auth session cookie:", cookies['better-auth.session_token']);
    
    // Check if we have a better-auth session cookie
    if (!cookies['better-auth.session_token']) {
      console.log("❌ Middleware: No better-auth session cookie found, redirecting to sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    // Make a request to the auth API to validate the session
    const authResponse = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });
    
    if (!authResponse.ok) {
      console.log("❌ Middleware: Auth API returned error, redirecting to sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    const sessionData = await authResponse.json();
    console.log("📋 Middleware: Session data:", sessionData);
    
    if (!sessionData.user) {
      console.log("❌ Middleware: No user in session, redirecting to sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    console.log("✅ Middleware: Session valid, proceeding");
    return NextResponse.next();
  } catch (err) {
    console.error("🚨 Middleware error:", err);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/form-generator(.*)", "/form-management(.*)", "/generate-form(.*)"],
};
