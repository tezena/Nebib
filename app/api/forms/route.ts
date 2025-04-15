// app/api/forms/route.ts
import { db } from "@/lib/db";
import getSession from "@/lib/get-session-user";
import { Type } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    console.log("*****************888888888", session);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { formData, publishData } = await request.json();

    // Validate required data
    if (!formData?.topic || !formData?.description || !formData?.fields) {
      return NextResponse.json(
        { error: "Missing required form data" },
        { status: 400 }
      );
    }
    // Create form with fields in a transaction
    const newForm = await db.$transaction(async (tx) => {
      // 1. Create the Form
      const form = await db.form.create({
        data: {
          userId: session.session.userId,
          topic: formData.topic,
          link: uuidv4(),
          description: formData.description,
          categories: formData.categories?.join(",") || null,
          status: "active",
          submissions: 0,
          type:
            publishData.shareSetting === "Public" ? Type.Public : Type.Private,
          accessMode:
            publishData.shareSetting === "private"
              ? publishData.accessCode
              : null,
        },
      });

      // 2. Create all associated Fields
      await db.field.createMany({
        data: formData.fields.map((field: any) => ({
          formId: form.id,
          label: field.label,
          type: field.type,
          category: field.category || null,
          required: field.required || false,
        })),
      });

      // 3. Return the form with its fields
      return await tx.form.findUnique({
        where: { id: form.id },
        include: { fields: true },
      });
    });

    return NextResponse.json({
      success: true,
      form: newForm,
    });
  } catch (error) {
    console.error("[FORM_PUBLISH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
