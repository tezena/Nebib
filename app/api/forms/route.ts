import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export const POST = async (request: Request) => {
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { topic, description, categories, fields } = body

    // Validate required fields
    if (!topic || !description) {
      return NextResponse.json(
        { error: "Topic and description are required" },
        { status: 400 }
      )
    }

    // Generate a unique link for the form
    const link = `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create the form
    const form = await db.form.create({
      data: {
        topic,
        description,
        categories: categories ? categories.join(',') : '',
        status: 'active',
        link,
        submissions: 0,
        type: 'Private',
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

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    console.error("🚨 [FORM_CREATION_ERROR]", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export const GET = async (request: Request) => {
  try {
    // Create a proper headers object for better-auth
    const headers = new Headers(request.headers)
    const session = await auth.api.getSession({ headers })
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    return NextResponse.json(forms, { status: 200 })
  } catch (error) {
    console.error("🚨 [FORMS_FETCH_ERROR]", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
