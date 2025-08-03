import { db } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { addCorsHeaders } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    console.log("🔍 Attempting to get session for form update...")
    
    // Create a proper headers object for better-auth
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    if (!session) {
      console.log("❌ No session found - returning unauthorized")
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      return addCorsHeaders(response, request);
    }

    const { id } = await params;
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

    // Check if form exists and belongs to user
    const existingForm = await db.form.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!existingForm) {
      const response = NextResponse.json({ error: "Form not found" }, { status: 404 })
      return addCorsHeaders(response, request);
    }

    // Update the form
    const updatedForm = await db.form.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        topic,
        description,
        categories: categories ? categories.join(',') : '',
        fields: {
          deleteMany: {},
          create: fields.map((field: any) => ({
            label: field.label,
            type: field.type,
            category: field.category || '',
            required: field.required || false,
            placeholder: field.placeholder,
            options: field.options ? JSON.stringify(field.options) : null,
          }))
        }
      },
      include: {
        fields: true,
      }
    })

    const response = NextResponse.json(updatedForm, { status: 200 })
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 [FORM_UPDATE_ERROR]", error)
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

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    console.log("🔍 Attempting to get session for form fetch...")
    
    // Create a proper headers object for better-auth
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    if (!session) {
      console.log("❌ No session found - returning unauthorized")
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      return addCorsHeaders(response, request);
    }

    const { id } = await params;

    // Get the specific form
    const form = await db.form.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        fields: true,
        datas: true,
      },
    })

    if (!form) {
      const response = NextResponse.json({ error: "Form not found" }, { status: 404 })
      return addCorsHeaders(response, request);
    }

    const response = NextResponse.json(form, { status: 200 })
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("🚨 [FORM_FETCH_ERROR]", error)
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
