import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addCorsHeaders } from "@/lib/cors";

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(response, request);
    }

    const { qrData } = await request.json();
    
    if (!qrData) {
      const response = NextResponse.json({ error: "QR data is required" }, { status: 400 });
      return addCorsHeaders(response, request);
    }

    // Parse QR data
    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (error) {
      const response = NextResponse.json({ error: "Invalid QR code data" }, { status: 400 });
      return addCorsHeaders(response, request);
    }

    // Validate QR data structure
    if (!parsedData.userId || !parsedData.formId || !parsedData.type) {
      const response = NextResponse.json({ error: "Invalid QR code format" }, { status: 400 });
      return addCorsHeaders(response, request);
    }

    if (parsedData.type !== "attendance") {
      const response = NextResponse.json({ error: "Invalid QR code type" }, { status: 400 });
      return addCorsHeaders(response, request);
    }

    // Check if form exists and user has access
    const form = await db.form.findFirst({
      where: {
        id: parsedData.formId,
        userId: session.user.id
      }
    });

    if (!form) {
      const response = NextResponse.json({ error: "Form not found or access denied" }, { status: 404 });
      return addCorsHeaders(response, request);
    }

    // Check if student exists in the form
    const student = await db.data.findFirst({
      where: {
        id: parsedData.userId,
        formId: parsedData.formId
      }
    });

    if (!student) {
      const response = NextResponse.json({ error: "Student not found in this form" }, { status: 404 });
      return addCorsHeaders(response, request);
    }

    // Determine attendance status based on time
    const now = new Date();
    const qrTimestamp = new Date(parsedData.timestamp);
    const timeDiff = now.getTime() - qrTimestamp.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    let status: 'present' | 'absent' | 'late' = 'present';
    if (minutesDiff > 15) {
      status = 'late';
    }

    // Check if attendance already marked for today
    const today = new Date().toISOString().split('T')[0];
    const existingAttendance = await db.data.findFirst({
      where: {
        id: parsedData.userId,
        formId: parsedData.formId,
        data: {
          path: ['date'],
          equals: today
        }
      }
    });

    if (existingAttendance) {
      // Update existing attendance
      const currentData = existingAttendance.data as any;
      const updatedData = {
        ...currentData,
        status,
        date: today,
        lastUpdated: now.toISOString()
      };

      await db.data.update({
        where: { id: existingAttendance.id },
        data: { data: updatedData }
      });
    } else {
      // Create new attendance record
      const attendanceData = {
        status,
        date: today,
        timestamp: parsedData.timestamp,
        formData: parsedData.formData || {},
        createdAt: now.toISOString()
      };

      await db.data.update({
        where: { id: parsedData.userId },
        data: { 
          data: {
            ...(student.data as any),
            attendance: attendanceData
          }
        }
      });
    }

    // Get student name for response
    const studentData = student.data as any;
    const studentName = studentData?.name || 
                       studentData?.fullName || 
                       studentData?.studentName || 
                       "Unknown Student";

    const response = NextResponse.json({
      success: true,
      message: `Attendance marked as ${status}`,
      data: {
        userId: parsedData.userId,
        studentName,
        status,
        timestamp: now.toISOString()
      }
    });

    return addCorsHeaders(response, request);

  } catch (error) {
    console.error("QR attendance error:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    return addCorsHeaders(response, request);
  }
}; 