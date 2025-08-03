import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { addCorsHeaders } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) => {
  try {
    console.log("🔍 Attempting to get session for draft fetch...")
    
    // Create a proper headers object for better-auth
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    if (!session) {
      console.log("❌ No session found - returning unauthorized")
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      return addCorsHeaders(response, request);
    }

    const { draftId } = await params;

    // Get the specific draft form
    const draftForm = await db.form.findFirst({
      where: {
        id: draftId,
        userId: session.user.id,
        status: 'draft',
      },
      include: {
        fields: true,
      },
    })

    if (!draftForm) {
      const response = NextResponse.json({ error: "Draft not found" }, { status: 404 })
      return addCorsHeaders(response, request);
    }

    const response = NextResponse.json(draftForm, { status: 200 })
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 [DRAFT_FETCH_ERROR]", error)
    const response = NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
    return addCorsHeaders(response, request);
  }
} 