import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🧪 Testing database connection...")

    // Test basic connection
    await db.$queryRaw`SELECT 1 as test`
    console.log("✅ Database query successful")

    // Count forms
    const formCount = await db.form.count()
    console.log("📊 Form count:", formCount)

    // Get first form
    const firstForm = await db.form.findFirst({
      select: { id: true, topic: true },
    })
    console.log("📋 First form:", firstForm)

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      formCount,
      firstForm,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🚨 Connection test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
