import { db } from "@/lib/db"
import { NextResponse } from "next/server"

type RouteParams = {
  formId: string
}

export const GET = async (request: Request, context: { params: RouteParams }) => {
  try {
    // Direct access to params without awaiting (for compatibility)
    const formId = context.params.formId

    console.log("🔍 API Route - Looking for form with ID:", formId)
    console.log("📋 API Route - Full context:", context)
    console.log("📋 API Route - Request URL:", request.url)

    // Validate that formId exists
    if (!formId) {
      console.error("❌ No formId provided in params")
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
    }

    // Query the database for the form
    const form = await db.form.findUnique({
      where: {
        id: formId,
      },
      include: {
        fields: true,
        datas: true,
      },
    })

    console.log("📋 Form query result:", form ? "Found" : "Not found")

    if (form) {
      console.log("📊 Form details:", {
        id: form.id,
        topic: form.topic,
        fieldsCount: form.fields?.length || 0,
        datasCount: form.datas?.length || 0,
      })
    }

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Return the form wrapped in an array to match your hook expectation
    return NextResponse.json([form], { status: 200 })
  } catch (error) {
    console.error("🚨 [FORM_DETAIL_FETCH_ERROR]", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
