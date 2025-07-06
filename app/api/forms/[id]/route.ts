import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

type RouteParams = {
  id: string
}

export const GET = async (request: Request, context: { params: Promise<RouteParams> }) => {
  try {
    // Await the params promise
    const { id: formId } = await context.params

    console.log("🔍 API - Looking for form with ID:", formId)
    console.log("📋 API - Request URL:", request.url)

    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
    }

    // Check authentication
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    console.log("📋 Session result:", session ? "Found" : "Not found")
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the form by ID and include fields and submissions
    const form = await db.form.findUnique({
      where: {
        id: formId,
        userId: session.user.id, // Only allow access to user's own forms
      },
      include: {
        fields: true,
        datas: true, // Include submissions
      },
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    console.log("✅ Form fetched successfully")

    return NextResponse.json(form, { status: 200 })
  } catch (error) {
    console.error("[FORM_FETCH_ERROR]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
