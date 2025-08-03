import { NextResponse, NextRequest } from "next/server"
import { addCorsHeaders } from "@/lib/cors";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }), request);
}

export const GET = async (request: NextRequest) => {
  try {
    console.log("Attendance Test API: Starting test");
    
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(response, request);
    }

    // Test 1: Check if user has any forms
    const userForms = await db.form.findMany({
      where: { userId: session.user.id },
      include: { datas: true }
    });

    console.log("Attendance Test API: User forms", { count: userForms.length });

    // Test 2: Check if there are any attendance records
    const attendanceRecords = await db.attendance.findMany({
      where: {
        form: {
          userId: session.user.id
        }
      },
      include: {
        form: true,
        data: true
      }
    });

    console.log("Attendance Test API: Attendance records", { count: attendanceRecords.length });

    // Test 3: Check database schema
    const dataRecords = await db.data.findMany({
      where: {
        form: {
          userId: session.user.id
        }
      },
      take: 5
    });

    console.log("Attendance Test API: Data records sample", { count: dataRecords.length });

    // Test 4: Create a test attendance record if we have data
    let testResult = null;
    if (dataRecords.length > 0 && userForms.length > 0) {
      const testData = dataRecords[0];
      const testForm = userForms[0];
      const testDate = new Date();

      // Check if test attendance already exists
      const existingTest = await db.attendance.findFirst({
        where: {
          formId: testForm.id,
          dataId: testData.id,
          date: testDate
        }
      });

      if (!existingTest) {
        testResult = await db.attendance.create({
          data: {
            formId: testForm.id,
            dataId: testData.id,
            userId: session.user.id,
            date: testDate,
            status: 'present',
            session: 'Test Session',
            markedAt: new Date(),
            markedBy: session.user.id,
            notes: 'Test attendance record'
          }
        });
        console.log("Attendance Test API: Created test attendance record", { id: testResult.id });
      } else {
        testResult = existingTest;
        console.log("Attendance Test API: Test attendance record already exists", { id: existingTest.id });
      }
    }

    // Test 5: Verify the test record
    let verificationResult = null;
    if (testResult) {
      verificationResult = await db.attendance.findUnique({
        where: { id: testResult.id },
        include: {
          form: true,
          data: true
        }
      });
    }

    const testReport = {
      user: {
        id: session.user.id,
        email: session.user.email
      },
      forms: {
        count: userForms.length,
        sample: userForms.slice(0, 2).map(f => ({ id: f.id, topic: f.topic, dataCount: f.datas.length }))
      },
      attendanceRecords: {
        count: attendanceRecords.length,
        sample: attendanceRecords.slice(0, 2).map(r => ({ 
          id: r.id, 
          status: r.status, 
          date: r.date,
          formTitle: r.form.topic 
        }))
      },
      dataRecords: {
        count: dataRecords.length,
        sample: dataRecords.slice(0, 2).map(d => ({ id: d.id, formId: d.formId }))
      },
      testResult: testResult ? {
        id: testResult.id,
        status: testResult.status,
        date: testResult.date
      } : null,
      verificationResult: verificationResult ? {
        id: verificationResult.id,
        status: verificationResult.status,
        formTitle: verificationResult.form.topic,
        dataId: verificationResult.dataId
      } : null,
      systemStatus: {
        database: 'Connected',
        attendanceModel: 'Available',
        formsModel: 'Available',
        dataModel: 'Available'
      }
    };

    console.log("Attendance Test API: Test completed successfully", testReport);

    const response = NextResponse.json({
      success: true,
      message: "Attendance system test completed",
      report: testReport
    });
    return addCorsHeaders(response, request);

  } catch (error) {
    console.error("Attendance Test API error:", error);
    console.error("Attendance Test API error stack:", error instanceof Error ? error.stack : 'No stack trace');
    
    const response = NextResponse.json({
      success: false,
      error: "Test failed",
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 });
    return addCorsHeaders(response, request);
  }
}; 