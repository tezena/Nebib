"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Download,
  Eye,
  FileText,
  Star,
  Award,
  Target,
  BarChart3,
  Clock3,
  UserCheck,
  UserX
} from "lucide-react";
import { Data, Field, Form } from "@prisma/client";
import { JsonObject } from "type-fest";
import { format } from "date-fns";

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | null;
}

interface StudentAttendance {
  studentId: string;
  studentName: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  lastAttendance: string;
  streak: number;
}

interface ReviewProps {
  data: Form & {
    datas: Data[] | null | undefined;
    fields: Field[];
  };
}

export default function Review({ data }: ReviewProps) {
  const { datas = [], fields } = data;
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  // Use real attendance data from localStorage or session storage
  useEffect(() => {
    const calculateRealAttendance = () => {
      const students: StudentAttendance[] = [];
      
      datas?.forEach((entry) => {
        const studentName = getStudentName(entry);
        const studentId = entry.id;
        
        // Get real attendance data from localStorage (where check-in component stores it)
        const attendanceHistoryKey = `attendance_history_${studentId}`;
        const attendanceStatusKey = `attendance_status_${studentId}`;
        
        // Get attendance history from localStorage
        const storedHistory = localStorage.getItem(attendanceHistoryKey);
        const storedStatus = localStorage.getItem(attendanceStatusKey);
        
        let attendanceHistory: AttendanceRecord[] = [];
        let currentStatus: 'present' | 'absent' | 'late' | null = null;
        
        if (storedHistory) {
          try {
            attendanceHistory = JSON.parse(storedHistory);
          } catch (e) {
            console.error('Error parsing attendance history:', e);
          }
        }
        
        if (storedStatus) {
          try {
            currentStatus = JSON.parse(storedStatus);
          } catch (e) {
            console.error('Error parsing attendance status:', e);
          }
        }
        
        // Calculate real attendance statistics
        const totalSessions = attendanceHistory.length;
        const presentCount = attendanceHistory.filter(r => r.status === 'present').length;
        const absentCount = attendanceHistory.filter(r => r.status === 'absent').length;
        const lateCount = attendanceHistory.filter(r => r.status === 'late').length;
        const attendanceRate = totalSessions > 0 ? (presentCount / totalSessions) * 100 : 0;
        
        // Calculate streak (consecutive present days)
        let streak = 0;
        const sortedHistory = [...attendanceHistory].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        for (const record of sortedHistory) {
          if (record.status === 'present') {
            streak++;
          } else {
            break;
          }
        }
        
        // Get last attendance date
        let lastAttendance = '';
        if (attendanceHistory.length > 0) {
          const lastRecord = sortedHistory[0];
          lastAttendance = lastRecord.date;
        }
        
        students.push({
          studentId,
          studentName,
          totalSessions,
          presentCount,
          absentCount,
          lateCount,
          attendanceRate,
          lastAttendance,
          streak
        });
      });
      
      setStudentAttendance(students);
      setLoading(false);
    };

    calculateRealAttendance();
  }, [datas]);

  const getStudentName = (entry: Data): string => {
    const nameField = fields.find(f => f.label.toLowerCase().includes('name'));
    const nameValue = nameField ? (entry.data as JsonObject)?.[nameField.id] : null;
    return typeof nameValue === 'string' ? nameValue : 'Unknown Student';
  };

  const getStudentInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAttendanceBadge = (rate: number) => {
    if (rate >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (rate >= 80) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (rate >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 7) return <Badge className="bg-purple-100 text-purple-800">🔥 {streak} days</Badge>;
    if (streak >= 5) return <Badge className="bg-orange-100 text-orange-800">⚡ {streak} days</Badge>;
    if (streak >= 3) return <Badge className="bg-blue-100 text-blue-800">📈 {streak} days</Badge>;
    return <Badge variant="outline">{streak} days</Badge>;
  };

  // Calculate overall statistics
  const totalStudents = studentAttendance.length;
  const averageAttendanceRate = totalStudents > 0 
    ? studentAttendance.reduce((sum, student) => sum + student.attendanceRate, 0) / totalStudents 
    : 0;
  
  const excellentStudents = studentAttendance.filter(s => s.attendanceRate >= 90).length;
  const goodStudents = studentAttendance.filter(s => s.attendanceRate >= 80 && s.attendanceRate < 90).length;
  const fairStudents = studentAttendance.filter(s => s.attendanceRate >= 70 && s.attendanceRate < 80).length;
  const needsImprovementStudents = studentAttendance.filter(s => s.attendanceRate < 70).length;

  const topPerformers = studentAttendance
    .sort((a, b) => b.attendanceRate - a.attendanceRate)
    .slice(0, 5);

  const needsAttention = studentAttendance
    .filter(s => s.attendanceRate < 75)
    .sort((a, b) => a.attendanceRate - b.attendanceRate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Attendance Review</h2>
                  <p className="text-gray-600">Comprehensive review of {data.topic} attendance</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Eye className="w-4 h-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                <p className="text-xs text-blue-600 mt-1">Active participants</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{averageAttendanceRate.toFixed(1)}%</p>
                <p className="text-xs text-green-600 mt-1">Overall performance</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Excellent Students</p>
                <p className="text-2xl font-bold text-gray-900">{excellentStudents}</p>
                <p className="text-xs text-purple-600 mt-1">≥90% attendance</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-gray-900">{needsImprovementStudents}</p>
                <p className="text-xs text-yellow-600 mt-1">&lt;75% attendance</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.length > 0 ? (
                topPerformers.map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.studentName}</p>
                        <p className="text-sm text-gray-600">{student.attendanceRate.toFixed(1)}% attendance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getAttendanceBadge(student.attendanceRate)}
                      {getStreakBadge(student.streak)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No attendance data available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Students Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {needsAttention.length > 0 ? (
                needsAttention.slice(0, 5).map((student) => (
                  <div key={student.studentId} className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <UserX className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.studentName}</p>
                        <p className="text-sm text-gray-600">{student.attendanceRate.toFixed(1)}% attendance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getAttendanceBadge(student.attendanceRate)}
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                        Contact
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>All students are performing well</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Student List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Student Attendance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">Student</th>
                  <th className="text-left p-3 font-medium text-gray-700">Attendance Rate</th>
                  <th className="text-left p-3 font-medium text-gray-700">Present</th>
                  <th className="text-left p-3 font-medium text-gray-700">Absent</th>
                  <th className="text-left p-3 font-medium text-gray-700">Late</th>
                  <th className="text-left p-3 font-medium text-gray-700">Current Streak</th>
                  <th className="text-left p-3 font-medium text-gray-700">Last Attendance</th>
                  <th className="text-left p-3 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {studentAttendance.length > 0 ? (
                  studentAttendance.map((student) => (
                    <tr key={student.studentId} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {getStudentInitials(student.studentName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900">{student.studentName}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{student.attendanceRate.toFixed(1)}%</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${student.attendanceRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-green-600 font-medium">{student.presentCount}</td>
                      <td className="p-3 text-sm text-red-600 font-medium">{student.absentCount}</td>
                      <td className="p-3 text-sm text-yellow-600 font-medium">{student.lateCount}</td>
                      <td className="p-3">
                        {getStreakBadge(student.streak)}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {student.lastAttendance ? format(new Date(student.lastAttendance), 'MMM dd, yyyy') : 'No attendance'}
                      </td>
                      <td className="p-3">
                        {getAttendanceBadge(student.attendanceRate)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No attendance data available yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Insights */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Summary Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">High Performers</span>
              </div>
              <p className="text-sm text-green-700">
                {excellentStudents} students maintain excellent attendance (≥90%)
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Room for Improvement</span>
              </div>
              <p className="text-sm text-blue-700">
                {needsImprovementStudents} students need support to improve attendance
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock3 className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Consistency</span>
              </div>
              <p className="text-sm text-purple-700">
                Average attendance rate of {averageAttendanceRate.toFixed(1)}% across all students
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 