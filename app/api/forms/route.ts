import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async (request: Request, { params }: { params: Promise<{ formid: string }> }) => {
  try {
    // In Next.js 15+, params is a Promise that needs to be awaited
    const { formid } = await params
    const formId = formid

    console.log("🔍 Looking for form with ID:", formId)
    console.log("📋 Params object:", { formid })

    // Validate that formId exists
    if (!formId) {
      console.error("❌ No formId provided in params")
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
    }

    // Rest of the code remains the same...
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
