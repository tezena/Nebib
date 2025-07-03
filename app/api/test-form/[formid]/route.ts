import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async (request: Request, { params }: { params: Promise<{ formId: string }> }) => {
  try {
    // In Next.js 15, params is a Promise and must be awaited
    const resolvedParams = await params
    const formId = resolvedParams.formId

    console.log("🧪 Testing form ID:", formId)
    console.log("📋 Resolved params:", resolvedParams)
    console.log("📋 Request URL:", request.url)

    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 })
    }

    // Test 1: Check if form exists (basic query)
    const basicForm = await db.form.findUnique({
      where: { id: formId },
    })

    console.log("📋 Basic form query:", basicForm ? "Found" : "Not found")

    // Test 2: Check with fields
    const formWithFields = await db.form.findUnique({
      where: { id: formId },
      include: { fields: true },
    })

    console.log("📊 Form with fields:", formWithFields ? "Found" : "Not found")

    // Test 3: Check with all relations
    const fullForm = await db.form.findUnique({
      where: { id: formId },
      include: {
        fields: true,
        datas: true,
      },
    })

    console.log("🔍 Full form query:", fullForm ? "Found" : "Not found")

    return NextResponse.json({
      formId,
      tests: {
        basicForm: !!basicForm,
        formWithFields: !!formWithFields,
        fullForm: !!fullForm,
      },
      data: fullForm,
    })
  } catch (error) {
    console.error("🚨 Test error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
