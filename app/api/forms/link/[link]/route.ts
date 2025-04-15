import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type GetParams = Promise<{ link: string }>;
export const GET = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { link } = await params;

    const form = await db.form.findFirst({
      where: {
        link: link,
      },
    });

    if (!form) {
      return new Response("Form Not Found", { status: 404 });
    }

    const formWithFields = await db.form.findUnique({
      where: {
        id: form.id,
      },
      include: {
        fields: true,
      },
    });

    console.log(
      "form with fields: ",
      formWithFields,
      "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"
    );

    return new Response(JSON.stringify(formWithFields), { status: 200 });
  } catch (error) {
    console.error("[FORMS_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
