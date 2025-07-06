import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const GET = async (request: Request) => {
  try {
    console.log("[Dashboard Simple] Starting...");
    
    const session = await auth.api.getSession({ headers: request.headers });
    console.log("[Dashboard Simple] Session:", session ? "Found" : "Not found");
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Dashboard Simple] User ID:", session.user.id);

    // Simple query without complex includes
    const forms = await db.form.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        topic: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            datas: true
          }
        }
      }
    });

    console.log("[Dashboard Simple] Forms found:", forms.length);

    // Calculate simple stats
    const totalForms = forms.length;
    const activeForms = forms.filter(f => f.status === 'active' || !f.status).length;
    const totalSubmissions = forms.reduce((sum, f) => sum + f._count.datas, 0);
    const avgResponseRate = totalForms > 0 ? Math.round((totalSubmissions / (totalForms * 10)) * 100) : 0;

    const response = {
      stats: {
        totalForms,
        activeForms,
        totalSubmissions,
        avgResponseRate,
        formTrend: 0,
        submissionTrend: 0,
        responseRateTrend: 0,
      },
      recentForms: forms.slice(0, 5).map(f => ({
        id: f.id,
        title: f.topic,
        submissions: f._count.datas,
        lastSubmission: "No submissions",
        status: f.status || "draft",
        category: "General",
        createdAt: f.createdAt.toISOString(),
      }))
    };

    console.log("[Dashboard Simple] Response:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("[Dashboard Simple] Error:", error);
    console.error("[Dashboard Simple] Stack:", error instanceof Error ? error.stack : "No stack");
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}; 