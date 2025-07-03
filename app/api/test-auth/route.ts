import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
  try {
    console.log("🔍 Testing auth...")
    console.log("🍪 Cookies:", request.headers.get("cookie"))
    
    // Create a proper headers object for better-auth
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    console.log("📋 Session:", session ? "Found" : "Not found")
    
    if (session) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name
        }
      })
    } else {
      return NextResponse.json({
        authenticated: false,
        message: "No session found"
      })
    }
  } catch (error) {
    console.error("🚨 Auth test error:", error)
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
} 