import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addCorsHeaders } from "@/lib/cors";
import { Type } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Debug API: Starting request");
    
    // Check authentication
    const headers = new Headers(request.headers);
    const session = await auth.api.getSession({ headers });
    
    console.log("📋 Debug API: Session result:", session ? "Found" : "Not found");
    if (session) {
      console.log("👤 Debug API: User ID:", session.user.id);
      console.log("📧 Debug API: User email:", session.user.email);
    } else {
      console.log("❌ Debug API: No session found");
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(response, request);
    }
    
    const body = await request.json();
    console.log("📦 Debug API: Received body:", body);
    
    // Check if we have the required data
    const { topic, description, categories, fields } = body;
    
    if (!topic || !description) {
      console.log("❌ Debug API: Missing required fields");
      const response = NextResponse.json(
        { error: "Topic and description are required" },
        { status: 400 }
      );
      return addCorsHeaders(response, request);
    }
    
    console.log("✅ Debug API: Validating form data...");
    console.log("📝 Topic:", topic);
    console.log("📄 Description:", description);
    console.log("🏷️ Categories:", categories);
    console.log("📋 Fields count:", fields?.length || 0);
    
    // Generate a unique link for the form
    const link = `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log("🔗 Generated link:", link);
    
    // Create the form
    console.log("💾 Debug API: Creating form in database...");
    const form = await db.form.create({
      data: {
        topic,
        description,
        categories: categories ? categories.join(',') : '',
        status: 'active',
        link,
        submissions: 0,
        type: Type.Private,
        userId: session.user.id,
        fields: {
          create: fields.map((field: any) => ({
            label: field.label,
            type: field.type,
            category: field.category || '',
            required: field.required || false,
          }))
        }
      },
      include: {
        fields: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
    
    console.log("✅ Debug API: Form created successfully!");
    console.log("🆔 Form ID:", form.id);
    console.log("👤 Form User ID:", form.userId);
    console.log("📋 Fields created:", form.fields.length);
    
    // Verify the form was created by fetching it
    const createdForm = await db.form.findUnique({
      where: { id: form.id },
      include: {
        fields: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
    
    console.log("🔍 Debug API: Verification - Form found:", !!createdForm);
    
    // Get all forms for this user
    const userForms = await db.form.findMany({
      where: { userId: session.user.id },
      include: {
        fields: true,
        datas: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log("📊 Debug API: Total forms for user:", userForms.length);
    
    const responseData = {
      success: true,
      form: {
        id: form.id,
        topic: form.topic,
        description: form.description,
        status: form.status,
        link: form.link,
        userId: form.userId,
        userEmail: form.user?.email,
        createdAt: form.createdAt,
        fieldsCount: form.fields.length,
        fields: form.fields.map(f => ({
          id: f.id,
          label: f.label,
          type: f.type,
          required: f.required
        }))
      },
      verification: {
        formFound: !!createdForm,
        totalUserForms: userForms.length
      },
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      }
    };
    
    console.log("✅ Debug API: Returning success response");
    
    const response = NextResponse.json(responseData, { status: 201 });
    return addCorsHeaders(response, request);
    
  } catch (error) {
    console.error("🚨 Debug API Error:", error);
    const response = NextResponse.json({
      error: "Debug API error",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
    return addCorsHeaders(response, request);
  }
} 