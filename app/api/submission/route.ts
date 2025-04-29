import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async function (request: Request) {
  try {
    const body = await request.json();
    // console.log("Received data:", body);

    if (!body.data) {
      throw new Error("no data is given to the server");
    }

    if (!body.formId) {
      throw new Error("Form Id is missing");
    }

    console.log({ data: body.data, formId: body.formId });

    const submission = await db.data.create({
      data: {
        data: body.data,
        formId: body.formId,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json("server error", { status: 500 });
  }
};
