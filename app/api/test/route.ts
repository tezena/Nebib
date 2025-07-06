import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    console.log("Test API: Starting database test");
    
    // Test basic database connection
    const forms = await db.form.findMany({
      take: 5,
      include: {
        datas: true,
        fields: true,
      },
    });

    console.log("Test API: Found forms", { count: forms.length });

    const users = await db.user.findMany({
      take: 5,
    });

    console.log("Test API: Found users", { count: users.length });

    return NextResponse.json({
      success: true,
      forms: forms.map(f => ({
        id: f.id,
        topic: f.topic,
        type: f.type,
        userId: f.userId,
        dataCount: f.datas?.length || 0,
        fieldCount: f.fields?.length || 0
      })),
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name
      }))
    });

  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { error: "Database error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}; 