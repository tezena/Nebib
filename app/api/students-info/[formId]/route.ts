import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type GetParams = Promise<{ formId: string }>;
//get students info
export const GET = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { formId } = await params;
    const studentsData = await db.form.findUnique({
      where: {
        id: formId,
      },
      include: {
        datas: true,
        fields: true,
      },
    });

    return NextResponse.json(studentsData);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json("server error", { status: 500 });
  }
};
