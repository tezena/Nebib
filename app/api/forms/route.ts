import { db } from "@/lib/db"
import { NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{ formId: string }>
}

export async function GET(request: Request, context: RouteParams) {
  try {
    console.log("🔍 API Route - Starting...")
    console.log("🔍 API Route - Request URL:", request.url)
    console.log("🔍 API Route - Context:", context)

    // Extract formId from URL as backup
    const url = new URL(request.url)
    const pathSegments = url.pathname.split("/").filter(Boolean)
    const formIdFromUrl = pathSegments[pathSegments.length - 1]

    console.log("🔍 API Route - Path segments:", pathSegments)
    console.log("🔍 API Route - FormId from URL:", formIdFromUrl)

    // Try to get formId from params
    let formId: string | undefined

    try {
      const resolvedParams = await context.params
      console.log("📋 API Route - Resolved params:", resolvedParams)
      formId = resolvedParams?.formId
    } catch (paramError) {
      console.error("❌ Error resolving params:", paramError)
      formId = formIdFromUrl // Fallback to URL extraction
    }

    console.log("🔍 API Route - Final formId:", formId)

    if (!formId || formId.trim() === "") {
      console.error("❌ No valid formId found")
      return NextResponse.json(
        {
          error: "Form ID is required",
          debug: {
            url: request.url,
            pathSegments,
            formIdFromUrl,
            formId,
          },
        },
        { status: 400 },
      )
    }

    console.log("✅ FormId validation passed, querying database...")

    // Test database connection first
    try {
      await db.$queryRaw`SELECT 1`
      console.log("✅ Database connection successful")
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
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

    if (!form) {
      console.log("❌ No form found with ID:", formId)

      // Check what forms exist
      const existingForms = await db.form.findMany({
        select: { id: true, topic: true },
        take: 5,
      })
      console.log("📊 Available forms:", existingForms)

      return NextResponse.json(
        {
          error: "Form not found",
          formId: formId,
          availableForms: existingForms,
        },
        { status: 404 },
      )
    }

    console.log("✅ Form found successfully")
    return NextResponse.json([form], { status: 200 })
  } catch (error) {
    console.error("🚨 [FORM_DETAIL_FETCH_ERROR]", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
