import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    console.log("🔍 Debugging all forms in database...")

    // Get all forms with their basic info
    const allForms = await db.form.findMany({
      select: {
        id: true,
        topic: true,
        description: true,
        createdAt: true,
        status: true,
      },
      take: 10, // Limit to first 10 forms
    })

    console.log("📊 Total forms found:", allForms.length)
    console.log("📋 Forms:", allForms)

    // Also get the count
    const totalCount = await db.form.count()

    return NextResponse.json({
      success: true,
      totalCount,
      forms: allForms,
      message: `Found ${allForms.length} forms in database`,
    })
  } catch (error) {
    console.error("🚨 Debug forms error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
