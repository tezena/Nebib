"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";
import { useEffect, useState } from "react";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  session: string;
}

interface SessionStats {
  session: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
  date?: string;
}

interface AttendanceStatistics {
  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalRecords: number;
  averageAttendance: number;
  totalSessions: number;
}

export default function Statistics() {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats[]>([]);
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/attendance", {
          credentials: 'include'
        });
        if (!res.ok) throw new Error("Failed to fetch attendance data");
        const data = await res.json();
        setAttendanceData(data.attendanceRecords || []);
        setSessionStats(data.sessionStats || []);
        setStatistics(data.statistics || null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, []);

  const totalStudents = statistics?.totalStudents || 0;
  const totalPresent = statistics?.totalPresent || 0;
  const totalAbsent = statistics?.totalAbsent || 0;
  const totalLate = statistics?.totalLate || 0;
  const totalRecords = statistics?.totalRecords || 0;
  const averageAttendance = statistics?.averageAttendance || 0;

  const pieData = [
    { name: 'Present', value: totalPresent, color: '#10b981' },
    { name: 'Absent', value: totalAbsent, color: '#ef4444' },
    { name: 'Late', value: totalLate, color: '#f59e0b' },
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  // Calculate insights
  const bestSession = sessionStats.reduce((best, current) => 
    current.attendanceRate > best.attendanceRate ? current : best, 
    { session: '', attendanceRate: 0, total: 0, present: 0, absent: 0, late: 0 }
  );

  const averageAttendanceRate = sessionStats.length > 0 
    ? sessionStats.reduce((sum, session) => sum + session.attendanceRate, 0) / sessionStats.length 
    : 0;

  const isImproving = sessionStats.length >= 2 && 
    sessionStats[sessionStats.length - 1].attendanceRate > sessionStats[sessionStats.length - 2].attendanceRate;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64 text-red-500">
          <AlertCircle className="w-6 h-6 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header Section */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Attendance Analytics</h2>
                    <p className="text-gray-600">Real-time insights from {totalStudents} students across {sessionStats.length} sessions</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <Button 
                    variant={chartType === 'bar' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={chartType === 'line' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    <Activity className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={chartType === 'pie' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setChartType('pie')}
                  >
                    <PieChartIcon className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <Button 
                    variant={timeRange === 'week' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('week')}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={timeRange === 'month' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('month')}
                  >
                    Month
                  </Button>
                  <Button 
                    variant={timeRange === 'quarter' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('quarter')}
                  >
                    Quarter
                  </Button>
                </div>
                
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                  <p className="text-xs text-blue-600 mt-1">Registered students</p>
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
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPresent}</p>
                  <p className="text-xs text-green-600 mt-1">{averageAttendance.toFixed(1)}% attendance rate</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAbsent}</p>
                  <p className="text-xs text-red-600 mt-1">{totalRecords > 0 ? (totalAbsent / totalRecords * 100).toFixed(1) : 0}% absence rate</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Late</p>
                  <p className="text-2xl font-bold text-gray-900">{totalLate}</p>
                  <p className="text-xs text-yellow-600 mt-1">{totalRecords > 0 ? (totalLate / totalRecords * 100).toFixed(1) : 0}% late rate</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Info */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Session Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Course:</span>
                    <span className="text-sm text-gray-900">Bible Study</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Instructor:</span>
                    <span className="text-sm text-gray-900">Fr. Abebe</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Start Date:</span>
                    <span className="text-sm text-gray-900">20/10/2024</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">End Date:</span>
                    <span className="text-sm text-gray-900">20/12/2024</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Total Sessions:</span>
                    <span className="text-sm text-gray-900">{sessionStats.length}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Real-time Insights</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Best Session</span>
                    </div>
                    <p className="text-sm text-green-700">
                      {bestSession.session} had the highest attendance with {bestSession.attendanceRate.toFixed(1)}% rate
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Overall Performance</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Average attendance rate: {averageAttendanceRate.toFixed(1)}% across all sessions
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Trend Analysis</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      {isImproving ? 'Attendance is improving' : 'Attendance needs attention'} in recent sessions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Attendance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {chartType === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="session" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#10b981" name="Present" />
                      <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                      <Bar dataKey="late" fill="#f59e0b" name="Late" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                
                {chartType === 'line' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sessionStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="session" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} name="Present" />
                      <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} name="Absent" />
                      <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} name="Late" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Overall Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Session</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Present</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Absent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Late</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionStats.map((session, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{session.session}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{session.total}</td>
                      <td className="py-3 px-4 text-sm text-green-600">{session.present}</td>
                      <td className="py-3 px-4 text-sm text-red-600">{session.absent}</td>
                      <td className="py-3 px-4 text-sm text-yellow-600">{session.late}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <Badge variant={session.attendanceRate >= 80 ? "default" : "secondary"}>
                          {session.attendanceRate.toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
