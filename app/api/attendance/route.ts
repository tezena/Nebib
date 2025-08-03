import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: NextRequest) => {
  try {
    console.log("Attendance API: Starting request");
    
    const session = await auth.api.getSession({ headers: request.headers });
    console.log("Attendance API: Session retrieved", { userId: session?.user?.id });
    
    if (!session?.user?.id) {
      console.log("Attendance API: No session found");
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(response, request);
    }

    // Get formId from query params if provided
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    
    console.log("Attendance API: Fetching attendance data", { userId: session.user.id, formId });
    
    // Build the where clause for attendance records
    const whereClause: any = {
      form: {
        userId: session.user.id
      }
    };
    
    if (formId) {
      whereClause.formId = formId;
    }

    // Fetch attendance records with related data
    const attendanceRecords = await db.attendance.findMany({
      where: whereClause,
      include: {
        form: {
          select: {
            id: true,
            topic: true,
            description: true
          }
        },
        data: {
          select: {
            id: true,
            data: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    console.log("Attendance API: Found attendance records", { count: attendanceRecords.length });

    // Process attendance records
    const processedRecords: any[] = [];
    const sessionStats: any[] = [];

    attendanceRecords.forEach(record => {
      try {
        // Extract student information from form data
        const formData = record.data.data as any;
        let studentName = 'Unknown Student';
        let studentEmail = '';
        
        // Try to find name and email in the form data
        if (formData.name) studentName = formData.name;
        else if (formData.fullName) studentName = formData.fullName;
        else if (formData.studentName) studentName = formData.studentName;
        else if (formData.firstName && formData.lastName) studentName = `${formData.firstName} ${formData.lastName}`;
        
        if (formData.email) studentEmail = formData.email;
        else if (formData.studentEmail) studentEmail = formData.studentEmail;
        
        const dateStr = record.date.toISOString().split('T')[0];
        const sessionName = `Session ${record.date.toLocaleDateString()}`;
        
        processedRecords.push({
          id: record.id,
          studentId: record.dataId,
          studentName,
          studentEmail,
          date: dateStr,
          status: record.status,
          session: record.session || sessionName,
          formId: record.formId,
          formTitle: record.form.topic,
          markedAt: record.markedAt.toISOString(),
          markedBy: record.markedBy,
          notes: record.notes
        });
        
      } catch (error) {
        console.error("Attendance API: Error processing attendance record", { recordId: record.id, error });
      }
    });

    // Group by date to create session stats
    const recordsByDate = new Map<string, any[]>();
    processedRecords.forEach(record => {
      if (!recordsByDate.has(record.date)) {
        recordsByDate.set(record.date, []);
      }
      recordsByDate.get(record.date)!.push(record);
    });

    // Calculate session stats
    recordsByDate.forEach((records, date) => {
      const sessionName = `Session ${new Date(date).toLocaleDateString()}`;
      const total = records.length;
      const present = records.filter(r => r.status === 'present').length;
      const absent = records.filter(r => r.status === 'absent').length;
      const late = records.filter(r => r.status === 'late').length;

      sessionStats.push({
        session: sessionName,
        total,
        present,
        absent,
        late,
        attendanceRate: total > 0 ? (present / total) * 100 : 0,
        date
      });
    });

    console.log("Attendance API: Processed records", { 
      attendanceRecordsCount: processedRecords.length,
      sessionStatsCount: sessionStats.length 
    });

    // Calculate overall statistics
    const totalStudents = new Set(processedRecords.map(r => r.studentId)).size;
    const totalPresent = processedRecords.filter(r => r.status === 'present').length;
    const totalAbsent = processedRecords.filter(r => r.status === 'absent').length;
    const totalLate = processedRecords.filter(r => r.status === 'late').length;
    const totalRecords = processedRecords.length;
    const averageAttendance = totalRecords > 0 ? ((totalPresent / totalRecords) * 100) : 0;

    const responseData = {
      attendanceRecords: processedRecords,
      sessionStats: sessionStats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      statistics: {
        totalStudents,
        totalPresent,
        totalAbsent,
        totalLate,
        totalRecords,
        averageAttendance,
        totalSessions: sessionStats.length
      }
    };

    console.log("Attendance API: Returning response", { 
      statistics: responseData.statistics,
      recordsCount: responseData.attendanceRecords.length 
    });

    const response = NextResponse.json(responseData);
    return addCorsHeaders(response, request);

  } catch (error) {
    console.error("Attendance API error:", error);
    console.error("Attendance API error stack:", error instanceof Error ? error.stack : 'No stack trace');
    const response = NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return addCorsHeaders(response, request);
  }
}; 