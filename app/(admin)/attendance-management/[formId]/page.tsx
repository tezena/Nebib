"use client";

import Students from "@/components/attendance-management/students";
import TabNavigation from "@/components/attendance-management/tab-navigation";
import { useState } from "react";
import { useGetStudents } from "../_hooks/student_hooks";
import { useParams, useRouter } from "next/navigation";
import Statistics from "@/components/attendance-management/statistics";
import CheckIn from "@/components/attendance-management/check-in";
import Review from "@/components/attendance-management/review";
import AttendanceMobileNavigation from "@/components/attendance-management/attendance-mobile-navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreHorizontal, Users, Calendar, BarChart3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function AttendanceManagementPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const tabs = ["students", "check-in", "review"];
  const { formId } = useParams();
  const router = useRouter();
  const { data } = useGetStudents(formId as string);

  const handleExport = () => {
    toast.info("Export feature coming soon!");
  };

  const handleSettings = () => {
    toast.info("Settings feature coming soon!");
  };

  const handleStats = () => {
    toast.info("Detailed stats feature coming soon!");
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center pb-20 md:pb-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Not Found</h3>
          <p className="text-gray-600">The requested attendance data could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 md:pb-8">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-2 h-8 w-8"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 truncate">{data.topic}</h1>
                <p className="text-xs text-gray-600">Attendance Management</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Desktop Back Button */}
        <div className="mb-6 hidden md:block">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Attendance
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
              <p className="text-gray-600 mt-1">Manage attendance for {data.topic}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Form ID:</span>
                <span className="text-sm text-gray-500 ml-2 font-mono">{formId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Form Info */}
        <div className="md:hidden mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{data.topic}</h2>
                <p className="text-sm text-gray-600 mb-2">{data.description}</p>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-blue-100 rounded-full">
                    <span className="text-xs font-medium text-blue-700">Form ID: {formId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mb-6">
          <AttendanceMobileNavigation 
            showBackButton={true}
            onViewStats={handleStats}
            onViewSettings={handleSettings}
          />
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:block mb-8">
          <TabNavigation
            tabs={tabs}
            currentTab={currentTab}
            onTabChange={(tab) => setCurrentTab(tab)}
          />
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex items-center space-x-2">
              {tabs.map((tab, index) => {
                const isActive = currentTab === index;
                const getTabIcon = (tab: string) => {
                  switch (tab.toLowerCase()) {
                    case 'students':
                      return <Users className="w-4 h-4" />;
                    case 'check-in':
                      return <Calendar className="w-4 h-4" />;
                    case 'review':
                      return <BarChart3 className="w-4 h-4" />;
                    default:
                      return null;
                  }
                };

                const getTabLabel = (tab: string) => {
                  switch (tab.toLowerCase()) {
                    case 'students':
                      return 'Students';
                    case 'check-in':
                      return 'Check-In';
                    case 'review':
                      return 'Review';
                    default:
                      return tab;
                  }
                };

                return (
                  <Button
                    key={tab}
                    variant="ghost"
                    size="sm"
                    className={`flex-1 h-12 flex flex-col items-center justify-center gap-1 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md" 
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }`}
                    onClick={() => setCurrentTab(index)}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {getTabIcon(tab)}
                    </div>
                    <span className={`text-xs font-medium transition-colors duration-200 ${
                      isActive ? "text-blue-700 font-semibold" : "text-gray-600"
                    }`}>
                      {getTabLabel(tab)}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-4 sm:p-8">
            {currentTab === 0 && data && <Students data={data} />}
            {currentTab === 1 && <CheckIn data={data} />}
            {currentTab === 2 && <Review data={data} />}
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="hidden md:block mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Attendance Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
