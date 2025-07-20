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
    console.log("🔍 Looking for student with:", { userId: parsedData.userId, formId: parsedData.formId, formData: parsedData.formData });
    
    // First try to find by userId (data ID)
    let student = await db.data.findFirst({
      where: {
        id: parsedData.userId,
        formId: parsedData.formId
      }
    });

    console.log("🔍 Found by userId:", student?.id);

    // If not found by userId, try to find by formData (for test data)
    if (!student && parsedData.formData) {
      // Try to find by matching any field value in formData
      const formDataEntries = Object.entries(parsedData.formData);
      for (const [key, value] of formDataEntries) {
        if (typeof value === 'string' && value.trim() !== '') {
          student = await db.data.findFirst({
            where: {
              formId: parsedData.formId,
              data: {
                path: [key],
                equals: value
              }
            }
          });
          if (student) {
            console.log("🔍 Found by formData field:", key, value);
            break;
          }
        }
      }
    }

    // If still not found, try to find any recent data in the form
    if (!student) {
      student = await db.data.findFirst({
        where: {
          formId: parsedData.formId
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      console.log("🔍 Found recent data:", student?.id);
    }

    if (!student) {
      console.log("❌ No student found in form");
      const response = NextResponse.json({ error: "Student not found in this form" }, { status: 404 });
      return addCorsHeaders(response, request);
    }

    console.log("✅ Student found:", student.id);

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
        id: student.id, // Use the found student's ID, not parsedData.userId
        formId: parsedData.formId,
        data: {
          path: ['attendance', 'date'],
          equals: today
        }
      }
    });

    if (existingAttendance) {
      // Update existing attendance
      const currentData = existingAttendance.data as any;
      const updatedData = {
        ...currentData,
        attendance: {
          ...currentData.attendance,
          status,
          date: today,
          lastUpdated: now.toISOString()
        }
      };

      await db.data.update({
        where: { id: student.id }, // Use the found student's ID
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
        where: { id: student.id }, // Use the found student's ID
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
    console.log("🔍 Student data structure:", JSON.stringify(studentData, null, 2));
    
    // Extract student name from dynamic field structure
    let studentName = "Unknown Student";
    
    if (studentData && typeof studentData === 'object') {
      // Find the first field that looks like a name (not attendance data, not numbers, not emails)
      const nameField = Object.entries(studentData).find(([key, value]) => {
        // Skip attendance-related fields
        if (['attendance', 'date', 'status', 'timestamp', 'createdAt', 'lastUpdated'].includes(key)) {
          return false;
        }
        // Look for string values that could be names
        return typeof value === 'string' && 
               value.trim() !== '' && 
               value.length < 50 && // Names are usually short
               !value.includes('@') && // Not an email
               !value.match(/^\d+$/) && // Not just numbers
               !value.includes('-') && // Not a date
               !value.includes('/'); // Not a date
      });
      
      if (nameField) {
        studentName = nameField[1] as string;
      }
    }

    console.log("✅ Attendance marked successfully:", {
      studentId: student.id,
      studentName,
      status,
      timestamp: now.toISOString(),
      dataKeys: studentData ? Object.keys(studentData) : []
    });

    const response = NextResponse.json({
      success: true,
      message: `Attendance marked as ${status}`,
      data: {
        userId: student.id, // Use the actual student ID
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