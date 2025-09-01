import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ link: string }> }
) {
  try {
    const { link } = await params
    console.log("🔍 Looking for public form with link:", link)

    if (!link) {
      const response = NextResponse.json({ error: "Link is required" }, { status: 400 })
      return addCorsHeaders(response, request)
    }

    const form = await db.form.findUnique({
      where: { id: link },
      include: { fields: true },
    })

    if (!form) {
      const response = NextResponse.json({ error: "Form not found" }, { status: 404 })
      return addCorsHeaders(response, request)
    }

    const response = NextResponse.json(form, { status: 200 })
    return addCorsHeaders(response, request)
  } catch (error) {
    console.error("[PUBLIC_FORM_FETCH_ERROR]", error)
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 })
    return addCorsHeaders(response, request)
  }
}