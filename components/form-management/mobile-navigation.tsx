"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  FileText, 
  Users, 
  Settings,
  Home,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

interface MobileNavigationProps {
  onSearch?: () => void;
  onFilter?: () => void;
  onCreateForm?: () => void;
  onViewStats?: () => void;
  onViewSettings?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function MobileNavigation({
  onSearch,
  onFilter,
  onCreateForm,
  onViewStats,
  onViewSettings,
  showBackButton = false,
  onBack
}: MobileNavigationProps) {
  const router = useRouter();

  const handleCreateForm = () => {
    if (onCreateForm) {
      onCreateForm();
    } else {
      router.push('/form-generator');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="md:hidden space-y-4">
      {/* Quick Actions */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="flex flex-col items-center gap-1 h-auto py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs">Home</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateForm}
              className="flex flex-col items-center gap-1 h-auto py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-xs">Create</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewStats}
              className="flex flex-col items-center gap-1 h-auto py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs">Stats</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewSettings}
              className="flex flex-col items-center gap-1 h-auto py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onSearch}
              className="flex items-center gap-2 justify-center border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onFilter}
              className="flex items-center gap-2 justify-center border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back Button (if needed) */}
      {showBackButton && (
        <Card className="border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="w-full flex items-center gap-2 justify-center border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 