import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const POST = async (request: Request) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { formId, studentId, date, status } = await request.json();
    if (!formId || !studentId || !date || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Find the Data record for this student/date/form
    let dataRecord = await db.data.findFirst({
      where: {
        formId,
        id: studentId,
      },
    });
    if (!dataRecord) {
      // If not found, create a new Data record
      dataRecord = await db.data.create({
        data: {
          id: studentId,
          formId,
          data: { status, date },
        },
      });
    } else {
      // If found, update the data field (append or update attendance for the date)
      let newData = { ...(dataRecord.data as any) };
      newData.status = status;
      newData.date = date;
      await db.data.update({
        where: { id: dataRecord.id },
        data: { data: newData },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Attendance mark error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}; 