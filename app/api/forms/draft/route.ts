import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { addCorsHeaders } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const POST = async (request: NextRequest) => {
  try {
    console.log("🔍 Attempting to get session for draft save...")
    
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
    const { title, description, sections, formId } = body

    // Validate required fields for draft
    if (!title || !title.trim()) {
      const response = NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
      return addCorsHeaders(response, request);
    }

    // Use default description if not provided
    const finalDescription = description && description.trim() ? description.trim() : "የቅጽ ማብራሪያ አልተሰጠም provided";

    let draftForm;

    if (formId) {
      // Update existing draft
      draftForm = await db.form.update({
        where: {
          id: formId,
          userId: session.user.id,
        },
        data: {
          topic: title,
          description: finalDescription,
          categories: sections ? sections.map((s: any) => s.title).join(',') : '',
          status: 'draft',
          fields: {
            deleteMany: {},
            create: sections ? sections.flatMap((section: any) => 
              section.fields.map((field: any) => ({
                label: field.label,
                type: field.type,
                category: section.title,
                required: field.required || false,
                placeholder: field.placeholder,
                options: field.options ? JSON.stringify(field.options) : null,
              }))
            ) : []
          }
        },
        include: {
          fields: true,
        }
      });
    } else {
      // Create new draft
      const link = `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      draftForm = await db.form.create({
        data: {
          topic: title,
          description: finalDescription,
          categories: sections ? sections.map((s: any) => s.title).join(',') : '',
          status: 'draft',
          link,
          submissions: 0,
          type: 'Private',
          userId: session.user.id,
          fields: {
            create: sections ? sections.flatMap((section: any) => 
              section.fields.map((field: any) => ({
                label: field.label,
                type: field.type,
                category: section.title,
                required: field.required || false,
                placeholder: field.placeholder,
                options: field.options ? JSON.stringify(field.options) : null,
              }))
            ) : []
          }
        },
        include: {
          fields: true,
        }
      });
    }

    const response = NextResponse.json(draftForm, { status: 201 })
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 [DRAFT_SAVE_ERROR]", error)
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
    // Create a proper headers object for better-auth
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    if (!session) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      return addCorsHeaders(response, request);
    }

    // Get all draft forms for the current user
    const draftForms = await db.form.findMany({
      where: {
        userId: session.user.id,
        status: 'draft',
      },
      include: {
        fields: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const response = NextResponse.json(draftForms, { status: 200 })
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 [DRAFTS_FETCH_ERROR]", error)
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