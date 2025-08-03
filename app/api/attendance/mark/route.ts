import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const POST = async (request: NextRequest) => {
  try {
    console.log("Attendance Mark API: Starting request");
    
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      console.log("Attendance Mark API: No session found");
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(response, request);
    }

    const { formId, studentId, date, status } = await request.json();
    console.log("Attendance Mark API: Request data", { formId, studentId, date, status });
    
    // Validate required fields
    if (!formId || !studentId || !date || !status) {
      console.log("Attendance Mark API: Missing required fields", { formId, studentId, date, status });
      const response = NextResponse.json({ 
        error: "Missing required fields", 
        required: ["formId", "studentId", "date", "status"],
        received: { formId, studentId, date, status }
      }, { status: 400 });
      return addCorsHeaders(response, request);
    }

    // Validate status
    const validStatuses = ['present', 'absent', 'late'];
    if (!validStatuses.includes(status)) {
      console.log("Attendance Mark API: Invalid status", { status });
      const response = NextResponse.json({ 
        error: "Invalid status", 
        validStatuses,
        received: status 
      }, { status: 400 });
      return addCorsHeaders(response, request);
    }

    // Verify the form exists and belongs to the user
    const form = await db.form.findFirst({
      where: {
        id: formId,
        userId: session.user.id
      }
    });

    if (!form) {
      console.log("Attendance Mark API: Form not found or unauthorized", { formId, userId: session.user.id });
      const response = NextResponse.json({ error: "Form not found or unauthorized" }, { status: 404 });
      return addCorsHeaders(response, request);
    }

    // Find the Data record for this student
    const dataRecord = await db.data.findFirst({
      where: {
        formId,
        id: studentId,
      },
    });

    if (!dataRecord) {
      console.log("Attendance Mark API: Data record not found", { formId, studentId });
      const response = NextResponse.json({ error: "Student data not found" }, { status: 404 });
      return addCorsHeaders(response, request);
    }

    console.log("Attendance Mark API: Found data record", { recordId: dataRecord.id });

    // Parse the date
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      console.log("Attendance Mark API: Invalid date format", { date });
      const response = NextResponse.json({ error: "Invalid date format" }, { status: 400 });
      return addCorsHeaders(response, request);
    }

    // Check if attendance record already exists for this date
    const existingAttendance = await db.attendance.findFirst({
      where: {
        formId,
        dataId: dataRecord.id,
        date: attendanceDate,
      },
    });

    let attendanceRecord;

    if (existingAttendance) {
      // Update existing attendance record
      console.log("Attendance Mark API: Updating existing attendance record", { attendanceId: existingAttendance.id });
      attendanceRecord = await db.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          status,
          markedAt: new Date(),
          markedBy: session.user.id,
        },
      });
    } else {
      // Create new attendance record
      console.log("Attendance Mark API: Creating new attendance record");
      attendanceRecord = await db.attendance.create({
        data: {
          formId,
          dataId: dataRecord.id,
          userId: session.user.id, // This should be the student's user ID, but we'll use the marking user for now
          date: attendanceDate,
          status,
          session: `Session ${attendanceDate.toLocaleDateString()}`,
          markedAt: new Date(),
          markedBy: session.user.id,
        },
      });
    }

    console.log("Attendance Mark API: Successfully marked attendance", { 
      formId, 
      studentId, 
      date, 
      status,
      attendanceId: attendanceRecord.id 
    });

    const response = NextResponse.json({ 
      success: true, 
      attendanceId: attendanceRecord.id,
      message: `Successfully marked as ${status}`
    });
    return addCorsHeaders(response, request);

  } catch (error) {
    console.error("Attendance Mark API error:", error);
    console.error("Attendance Mark API error stack:", error instanceof Error ? error.stack : 'No stack trace');
    
    const response = NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
    return addCorsHeaders(response, request);
  }
}; 