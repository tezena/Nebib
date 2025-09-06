"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Search,
  Filter,
  Calendar,
  Users,
  MoreHorizontal,
  Download
} from "lucide-react";
import Link from "next/link";
import { useDashboardData } from "./_hooks/dashboard_hooks";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function DashboardPage() {
  const { data: forms, isLoading, error } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Show loading skeleton if data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 md:pb-8" style={{ backgroundColor: '#f7f7f7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#382606' }}>ቅጾች</h1>
                <p className="mt-1" style={{ color: '#382606', opacity: 0.8 }}>ሁሉንም ቅጾችዎን ያስተዳድሩ</p>
              </div>
            </div>
          </div>

          {/* Search and Filter - Loading Skeleton */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>

          {/* Forms Grid - Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pb-20 md:pb-8" style={{ backgroundColor: '#f7f7f7' }}>
        <div className="text-center">
          <FileText className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#382606' }}>ቅጾችን ማግኛ ስህተት</h2>
          <p style={{ color: '#382606', opacity: 0.7 }}>ቅጾችን ማግኛ አልተሳካም። እባክዎ እንደገና ይሞክሩ።</p>
        </div>
      </div>
    );
  }

  // Filter forms based on search and status
  const filteredForms = forms?.filter(form => {
    const matchesSearch = form.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#382606' }}>ቅጾች</h1>
              <p className="mt-1" style={{ color: '#382606', opacity: 0.8 }}>ሁሉንም ቅጾችዎን ያስተዳድሩ</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/form-generator">
                <Button className="text-white shadow-lg border-0" style={{ backgroundColor: '#f4be42' }}>
                  <Plus className="w-4 h-4 mr-2" />
                  ቅጽ ፍጠር
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="ቅጾችን ይፈልጉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:border-[#f4be42] focus:ring-[#f4be42]"
              style={{ color: '#382606' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4be42] focus:border-transparent bg-white"
            style={{ color: '#382606' }}
          >
            <option value="all">ሁሉም ሁኔታ</option>
            <option value="active">ንቁ</option>
            <option value="draft">ረቂቅ</option>
            <option value="archived">ተጠባቀቀ</option>
          </select>
        </div>

        {/* Forms Grid */}
        {filteredForms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <Card key={form.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Form Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate" style={{ color: '#382606' }}>{form.topic}</h3>
                        <p className="text-sm mt-1 line-clamp-2" style={{ color: '#382606', opacity: 0.7 }}>{form.description || "ምንም መግለጫ የለም"}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <MoreHorizontal className="w-4 h-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-gray-200">
                          <DropdownMenuItem asChild className="text-gray-700 hover:bg-gray-100">
                            <Link href={`/form-generator?edit=1&id=${form.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              ቅጽ አርትዕ
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
                            <Download className="w-4 h-4 mr-2" />
                            ውሂብ ወደ ውጭ ላክ
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" />
                            ቅጽ ሰርዝ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Form Stats */}
                    <div className="flex items-center gap-4 text-sm" style={{ color: '#382606', opacity: 0.7 }}>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{form.datas?.length || 0} ምላሾች</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(form.createdAt || new Date().toISOString())}</span>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <Badge className={getStatusColor(form.status)}>
                        {form.status === 'active' ? 'ንቁ' : form.status === 'draft' ? 'ረቂቅ' : 'ተጠባቀቀ'}
                      </Badge>
                      <Link href={`/form-management/${form.id}`}>
                        <Button variant="outline" size="sm" className="hover:bg-gray-50 hover:border-gray-300 border-gray-300" style={{ color: '#382606' }}>
                          <Eye className="w-4 h-4 mr-2" />
                          አስተዳድር
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#382606' }}>
              {searchTerm || statusFilter !== "all" ? "ቅጽ አልተገኘም" : "እስካሁን ቅጽ አልተፈጠረም"}
            </h3>
            <p className="mb-6" style={{ color: '#382606', opacity: 0.7 }}>
              {searchTerm || statusFilter !== "all" 
                ? "የፍለጋ ወይም የማጣሪያ መስፈርቶችዎን ይለውጡ" 
                : "የመጀመሪያውን ቅጽዎን በመፍጠር ይጀምሩ"
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Link href="/form-generator">
                <Button className="text-white border-0" style={{ backgroundColor: '#f4be42' }}>
                  <Plus className="w-4 h-4 mr-2" />
                  የመጀመሪያውን ቅጽዎን ፍጠር
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/form-generator">
        <Button className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 z-50 border-0" style={{ backgroundColor: '#f4be42' }}>
          <Plus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
} 