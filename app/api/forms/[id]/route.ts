import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type GetParams = Promise<{ id: string }>;
export const GET = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { id } = await params;

    const form = await db.form.findUnique({
      where: {
        id: id,
      },
      include: {
        fields: true,
      },
    });

    console.log(form);

    return new Response(JSON.stringify(form), { status: 200 });
  } catch (error) {
    console.error("[FORMS_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
