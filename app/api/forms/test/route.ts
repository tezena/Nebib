import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addCorsHeaders } from "@/lib/cors";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Test API: Starting request");
    
    // Check authentication
    const headers = new Headers(request.headers);
    const session = await auth.api.getSession({ headers });
    
    console.log("📋 Test API: Session result:", session ? "Found" : "Not found");
    if (session) {
      console.log("👤 Test API: User ID:", session.user.id);
      console.log("📧 Test API: User email:", session.user.email);
    } else {
      console.log("❌ Test API: No session found");
    }
    
    // Get all forms in the database (for debugging)
    const allForms = await db.form.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        fields: true,
        datas: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log("📊 Test API: Total forms in database:", allForms.length);
    
    // Get forms for the current user (if authenticated)
    let userForms = [];
    if (session) {
      userForms = await db.form.findMany({
        where: {
          userId: session.user.id
        },
        include: {
          fields: true,
          datas: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      console.log("👤 Test API: Forms for current user:", userForms.length);
    }
    
    // Get user count
    const userCount = await db.user.count();
    console.log("👥 Test API: Total users in database:", userCount);
    
    const responseData = {
      authenticated: !!session,
      user: session ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      } : null,
      totalForms: allForms.length,
      userForms: userForms.length,
      totalUsers: userCount,
      allForms: allForms.map(form => ({
        id: form.id,
        topic: form.topic,
        userId: form.userId,
        userEmail: form.user?.email,
        status: form.status,
        createdAt: form.createdAt,
        fieldsCount: form.fields.length,
        submissionsCount: form.datas.length
      }))
    };
    
    console.log("✅ Test API: Returning response data");
    
    const response = NextResponse.json(responseData);
    return addCorsHeaders(response, request);
    
  } catch (error) {
    console.error("🚨 Test API Error:", error);
    const response = NextResponse.json({
      error: "Test API error",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
    return addCorsHeaders(response, request);
  }
} 