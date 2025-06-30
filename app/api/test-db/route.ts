import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    // Try to import your database client
    const { db } = await import("@/lib/db")

    console.log("✅ Database client imported")

    // Test basic connection
    await db.$queryRaw`SELECT 1 as test`
    console.log("✅ Database connection successful")

    // Try to count forms
    const formCount = await db.form.count()
    console.log("📊 Total forms in database:", formCount)

    // Get first few forms
    const forms = await db.form.findMany({
      take: 3,
      select: {
        id: true,
        topic: true,
        createdAt: true,
      },
    })

    console.log("📋 Sample forms:", forms)

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      formCount,
      sampleForms: forms,
    })
  } catch (error) {
    console.error("🚨 Database test failed:", error)

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
