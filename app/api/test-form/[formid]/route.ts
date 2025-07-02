import { db } from "@/lib/db"
import { NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ formId: string }>
}

export const GET = async (request: Request, { params }: RouteParams) => {
  try {
    const { formId } = await params

    console.log("🧪 Testing form ID:", formId)
    console.log("📋 Full params:", params)

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
