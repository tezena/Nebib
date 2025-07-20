"use client";

import { useEffect, useState } from "react";
import { Data, Field, Form } from "@prisma/client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { JsonObject } from "type-fest";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckSquare,
  Square,
  CalendarDays,
  Grid3X3,
  List,
  QrCode,
  ArrowLeft,
  MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";
import AttendanceCalendar from "./attendance-calendar";
import { format } from "date-fns";
import QRScanner from "@/components/qr-code/qr-scanner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface StudentsDatasProps {
  data: Form & {
    datas: Data[] | null | undefined;
    fields: Field[];
  };
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | null;
}

export default function CheckIn({ data }: StudentsDatasProps) {
  const { datas = [], fields } = data;
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, 'present' | 'absent' | 'late' | null>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'late' | 'unmarked'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'calendar' | 'qr'>('cards');
  const [attendanceHistory, setAttendanceHistory] = useState<Record<string, AttendanceRecord[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real attendance records for this form
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/attendance?formId=${data.id}`, {
        credentials: 'include'
      });
        if (!res.ok) throw new Error("Failed to fetch attendance records");
        const result = await res.json();
        // Filter records for this form only
        const records = (result.attendanceRecords || []).filter((r: any) => r.formId === data.id);
        // Build status and history maps
        const statusMap: Record<string, 'present' | 'absent' | 'late' | null> = {};
        const historyMap: Record<string, AttendanceRecord[]> = {};
        records.forEach((rec: any) => {
          if (!historyMap[rec.studentId]) historyMap[rec.studentId] = [];
          historyMap[rec.studentId].push({ date: rec.date, status: rec.status });
          // Set today's status
          if (rec.date === format(new Date(), 'yyyy-MM-dd')) {
            statusMap[rec.studentId] = rec.status;
          }
        });
        setAttendanceStatus(statusMap);
        setAttendanceHistory(historyMap);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [data.id]);

  const filteredDatas = datas?.filter((entry) => {
    if (!entry.data || typeof entry.data !== "object") return false;

    const matchesSearch = Object.values(entry.data as JsonObject).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!matchesSearch) return false;

    // Apply status filter
    const status = attendanceStatus[entry.id];
    switch (filterStatus) {
      case 'present':
        return status === 'present';
      case 'absent':
        return status === 'absent';
      case 'late':
        return status === 'late';
      case 'unmarked':
        return status === null || status === undefined;
      default:
        return true;
    }
  });

  // Update handleCheckIn to POST to backend
  const handleCheckIn = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedHistory = [
      ...(attendanceHistory[studentId] || []).filter(record => record.date !== today),
      { date: today, status }
    ];
    setAttendanceHistory(prev => ({ ...prev, [studentId]: updatedHistory }));
    try {
      const res = await fetch(`/api/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ formId: data.id, studentId, date: today, status }),
      });
      if (!res.ok) throw new Error("Failed to mark attendance");
      toast.success(`Marked as ${status}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to mark attendance");
    }
  };

  // Update handleCalendarDateClick to POST to backend
  const handleCalendarDateClick = async (studentId: string, date: Date, status: 'present' | 'absent' | 'late') => {
    const student = filteredDatas?.find(entry => entry.id === studentId);
    if (!student) return;
    
    const registrationDate = new Date(student.createdAt);
    const checkDate = new Date(date);
    
    // Compare dates at day level (ignoring time)
    const registrationDay = new Date(registrationDate.getFullYear(), registrationDate.getMonth(), registrationDate.getDate());
    const checkDay = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    
    // Don't allow marking attendance before registration date
    if (checkDay < registrationDay) {
      toast.error(`Cannot mark attendance before registration date (${format(registrationDate, 'MMM dd, yyyy')})`);
      return;
    }
    
    // Don't allow marking attendance for future dates
    if (checkDay > today) {
      toast.error("Cannot mark attendance for future dates");
      return;
    }
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const updatedHistory = [
      ...(attendanceHistory[studentId] || []).filter(record => record.date !== dateStr),
      { date: dateStr, status }
    ];
    setAttendanceHistory(prev => ({ ...prev, [studentId]: updatedHistory }));
    if (dateStr === format(new Date(), 'yyyy-MM-dd')) {
      setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
    }
    try {
      const res = await fetch(`/api/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ formId: data.id, studentId, date: dateStr, status }),
      });
      if (!res.ok) throw new Error("Failed to update attendance");
      toast.success(`Updated attendance for ${format(date, 'MMM dd, yyyy')}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update attendance");
    }
  };

  const getStatusBadge = (status: 'present' | 'absent' | 'late' | null) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      default:
        return <Badge variant="outline">Unmarked</Badge>;
    }
  };

  const getStatusIcon = (status: 'present' | 'absent' | 'late' | null) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      case 'absent':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
      case 'late':
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />;
      default:
        return <Square className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    }
  };

  const getStudentName = (entry: Data): string => {
    const nameField = fields.find(f => f.label.toLowerCase().includes('name'));
    const nameValue = nameField ? (entry.data as JsonObject)?.[nameField.id] : null;
    return typeof nameValue === 'string' ? nameValue : 'Unknown Student';
  };

  const getStudentInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const presentCount = Object.values(attendanceStatus).filter(s => s === 'present').length;
  const absentCount = Object.values(attendanceStatus).filter(s => s === 'absent').length;
  const lateCount = Object.values(attendanceStatus).filter(s => s === 'late').length;
  const unmarkedCount = (datas?.length || 0) - presentCount - absentCount - lateCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Desktop Header */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Attendance Check-In</h2>
                <p className="text-gray-600">Mark attendance for {data.topic}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search students..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[300px] border-gray-200 focus:border-green-500" 
              />
            </div>
            
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
              className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={() => {
                toast.success("Attendance saved successfully!");
              }}
            >
              <CheckCircle className="w-4 h-4" />
              Save Attendance
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Check-In</h2>
            <p className="text-sm text-gray-500">{filteredDatas?.length || 0} students</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("Export feature coming soon!")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Attendance saved successfully!")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Save Attendance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search students..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-green-500" 
          />
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-white/20 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Present</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{presentCount}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-white/20 bg-gradient-to-r from-red-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Absent</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{absentCount}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <XCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-white/20 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Late</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{lateCount}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-white/20 bg-gradient-to-r from-gray-50 to-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Unmarked</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{unmarkedCount}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Controls */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">View Mode:</span>
          <Button 
            variant={viewMode === 'cards' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('cards')}
            className="gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            Cards
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="gap-2"
          >
            <CalendarDays className="w-4 h-4" />
            Calendar
          </Button>
          <Button 
            variant={viewMode === 'qr' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('qr')}
            className="gap-2"
          >
            <QrCode className="w-4 h-4" />
            QR Scanner
          </Button>
        </div>
      </div>

      {/* Mobile View Mode Toggle */}
      <div className="md:hidden">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
          <div className="flex gap-1">
            <Button 
              variant={viewMode === 'cards' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('cards')}
              className="flex-1"
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Cards
            </Button>
            <Button 
              variant={viewMode === 'calendar' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="flex-1"
            >
              <CalendarDays className="w-4 h-4 mr-1" />
              Calendar
            </Button>
            <Button 
              variant={viewMode === 'qr' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('qr')}
              className="flex-1"
            >
              <QrCode className="w-4 h-4 mr-1" />
              QR
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filterStatus === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilterStatus('all')}
          className="text-xs sm:text-sm"
        >
          All ({(datas?.length || 0)})
        </Button>
        <Button 
          variant={filterStatus === 'present' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilterStatus('present')}
          className={`text-xs sm:text-sm ${filterStatus === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          Present ({presentCount})
        </Button>
        <Button 
          variant={filterStatus === 'absent' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilterStatus('absent')}
          className={`text-xs sm:text-sm ${filterStatus === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}`}
        >
          Absent ({absentCount})
        </Button>
        <Button 
          variant={filterStatus === 'late' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilterStatus('late')}
          className={`text-xs sm:text-sm ${filterStatus === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
        >
          Late ({lateCount})
        </Button>
        <Button 
          variant={filterStatus === 'unmarked' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilterStatus('unmarked')}
          className="text-xs sm:text-sm"
        >
          Unmarked ({unmarkedCount})
        </Button>
      </div>

      {/* Students List */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredDatas?.map((entry) => {
            const studentName = getStudentName(entry);
            const initials = getStudentInitials(studentName);
            const status = attendanceStatus[entry.id];
            const registrationDate = new Date(entry.createdAt);
            const history = attendanceHistory[entry.id] || [];
            
            return (
              <Card key={entry.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="w-8 h-8 sm:w-12 sm:h-12">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs sm:text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{studentName}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">ID: {entry.id.slice(-6)}</p>
                      </div>
                    </div>
                    {getStatusIcon(status)}
                  </div>

                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    {fields.slice(0, 2).map((field) => (
                      <div key={field.id} className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">{field.label}:</span>
                        <span className="font-medium text-gray-900 truncate ml-2">
                          {String((entry.data as JsonObject)?.[field.id] ?? "N/A")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    {getStatusBadge(status)}
                  </div>

                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant={status === 'present' ? 'default' : 'outline'}
                      onClick={() => handleCheckIn(entry.id, 'present')}
                      className={`text-xs ${status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    >
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={status === 'absent' ? 'default' : 'outline'}
                      onClick={() => handleCheckIn(entry.id, 'absent')}
                      className={`text-xs ${status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                    >
                      Absent
                    </Button>
                    <Button
                      size="sm"
                      variant={status === 'late' ? 'default' : 'outline'}
                      onClick={() => handleCheckIn(entry.id, 'late')}
                      className={`text-xs ${status === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
                    >
                      Late
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-4 sm:p-6">
            <AttendanceCalendar 
              students={(filteredDatas || []).map(entry => ({
                id: entry.id,
                name: getStudentName(entry),
                history: attendanceHistory[entry.id] || [],
                registrationDate: new Date(entry.createdAt)
              }))}
              onDateClick={handleCalendarDateClick}
            />
          </div>
        </div>
      )}

      {viewMode === 'qr' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-4 sm:p-6">
              <QRScanner 
                onScan={async (qrData) => {
                  try {
                    console.log('🔍 Processing QR scan:', qrData);
                    
                    // Send QR data to API for processing
                    const response = await fetch('/api/qr-attendance', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                      body: JSON.stringify({ qrData })
                    });

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.error || 'Failed to process QR code');
                    }

                    const result = await response.json();
                    
                    // Call the existing handleCheckIn function
                    await handleCheckIn(result.data.userId, result.data.status);
                    
                    toast.success(`${result.data.studentName} marked as ${result.data.status}`);
                    
                  } catch (error: any) {
                    console.error('❌ QR scan error:', error);
                    toast.error(error.message || 'Failed to process QR code');
                  }
                }}
                onError={(error) => {
                  console.error('❌ QR scanner error:', error);
                  toast.error(error);
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
