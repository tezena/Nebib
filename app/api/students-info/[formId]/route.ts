import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Type for params
// GET and POST use formId from params, PUT/DELETE use studentId from body

type GetParams = Promise<{ formId: string }>;

// GET: List all students for a form
export const GET = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { formId } = await params;
    const studentsData = await db.form.findUnique({
      where: { id: formId },
      include: { datas: true, fields: true },
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

// POST: Add a new student (Data row)
export const POST = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { formId } = await params;
    const body = await request.json(); // expects { data: {...} }
    const newStudent = await db.data.create({
      data: {
        formId,
        data: body.data,
      },
    });
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json("server error", { status: 500 });
  }
};

// PUT: Update a student (Data row)
export const PUT = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { formId } = await params;
    const body = await request.json(); // expects { studentId, data }
    const updatedStudent = await db.data.update({
      where: { id: body.studentId, formId },
      data: { data: body.data },
    });
    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json("server error", { status: 500 });
  }
};

// DELETE: Remove a student (Data row)
export const DELETE = async function (
  request: Request,
  { params }: { params: GetParams }
) {
  try {
    const { formId } = await params;
    const body = await request.json(); // expects { studentId }
    await db.data.delete({
      where: { id: body.studentId, formId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json("server error", { status: 500 });
  }
};
