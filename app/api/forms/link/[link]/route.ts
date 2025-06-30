import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async (request: Request, { params }: { params: Promise<{ formid: string }> }) => {
  try {
    // In Next.js 15+, params is a Promise that needs to be awaited
    const { formid } = await params
    const formId = formid

    console.log("🔍 Looking for public form with ID:", formId)

    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
    }

    // Find the form by ID and include fields
    const form = await db.form.findUnique({
      where: {
        id: formId,
      },
      include: {
        fields: true,
      },
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    console.log("Public form fetched: ", form)

    return NextResponse.json(form, { status: 200 })
  } catch (error) {
    console.error("[PUBLIC_FORM_FETCH_ERROR]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
