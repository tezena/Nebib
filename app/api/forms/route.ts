import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { addCorsHeaders } from "@/lib/cors"
import { Type } from "@prisma/client"

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const POST = async (request: NextRequest) => {
  try {
    console.log("🔍 Attempting to get session...")
    console.log("🍪 Request cookies:", request.headers.get("cookie"))
    
    // Create a proper headers object for better-auth
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    console.log("📋 Session result:", session ? "Found" : "Not found")
    if (session) {
      console.log("👤 User ID:", session.user.id)
      console.log("📧 User email:", session.user.email)
    }
    
    if (!session) {
      console.log("❌ No session found - returning unauthorized")
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      return addCorsHeaders(response, request);
    }

    const body = await request.json()
    const { topic, description, categories, fields } = body

    // Validate required fields
    if (!topic || !description) {
      const response = NextResponse.json(
        { error: "Topic and description are required" },
        { status: 400 }
      )
      return addCorsHeaders(response, request);
    }

    // Generate a unique link for the form
    const link = `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    console.log("💾 Forms API: Creating form with data:", {
      topic,
      description,
      categories: categories ? categories.join(',') : '',
      status: 'active',
      link,
      type: Type.Private,
      userId: session.user.id,
      fieldsCount: fields.length
    });
    
    // Create the form
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
      }
    })
    
    console.log("✅ Forms API: Form created successfully:", {
      id: form.id,
      topic: form.topic,
      status: form.status,
      type: form.type,
      fieldsCount: form.fields.length
    });

    const response = NextResponse.json(form, { status: 201 })
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 [FORM_CREATION_ERROR]", error)
    const response = NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
    return addCorsHeaders(response, request);
  }
}

export const GET = async (request: NextRequest) => {
  try {
    console.log("🔍 Forms API: Starting GET request");
    
    // Create a proper headers object for better-auth
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    console.log("📋 Forms API: Session result:", session ? "Found" : "Not found");
    if (session) {
      console.log("👤 Forms API: User ID:", session.user.id);
      console.log("📧 Forms API: User email:", session.user.email);
    }
    
    if (!session) {
      console.log("❌ Forms API: No session found - returning unauthorized");
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      return addCorsHeaders(response, request);
    }

    console.log("🔍 Forms API: Fetching forms for user:", session.user.id);
    
    // Get all forms for the current user
    const forms = await db.form.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        fields: true,
        datas: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log("✅ Forms API: Found forms:", forms.length);
    forms.forEach((form, index) => {
      console.log(`📋 Form ${index + 1}:`, {
        id: form.id,
        topic: form.topic,
        status: form.status,
        type: form.type,
        fieldsCount: form.fields.length,
        submissionsCount: form.datas.length
      });
    });

    const response = NextResponse.json(forms, { status: 200 })
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 [FORMS_FETCH_ERROR]", error)
    const response = NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
    return addCorsHeaders(response, request);
  }
}
