"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Share2, 
  Download, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink,
  Eye,
  MoreHorizontal,
  BarChart3,
  Users,
  Calendar
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface FormActionsProps {
  onShare?: () => void;
  onExport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopyLink?: () => void;
  onOpenForm?: () => void;
  onPreview?: () => void;
  onViewStats?: () => void;
  isMobile?: boolean;
}

export default function FormActions({
  onShare,
  onExport,
  onEdit,
  onDelete,
  onCopyLink,
  onOpenForm,
  onPreview,
  onViewStats,
  isMobile = false
}: FormActionsProps) {
  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onOpenForm}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Form
          </Button>
          
          <Button
            variant="outline"
            onClick={onCopyLink}
            className="border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            className="flex flex-col items-center gap-1 h-auto py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs">Preview</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewStats}
            className="flex flex-col items-center gap-1 h-auto py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs">Stats</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="flex flex-col items-center gap-1 h-auto py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs">Edit</span>
          </Button>
        </div>

        {/* Tertiary Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="flex flex-col items-center gap-1 h-auto py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Share2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs">Share</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="flex flex-col items-center gap-1 h-auto py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs">Export</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="flex flex-col items-center gap-1 h-auto py-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-xs">Delete</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Primary Actions */}
      <Button
        onClick={onOpenForm}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Open Form
      </Button>
      
      <Button
        variant="outline"
        onClick={onCopyLink}
        className="border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy Link
      </Button>

      {/* Secondary Actions */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onPreview}
        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Eye className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
        Preview
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onViewStats}
        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <BarChart3 className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
        Stats
      </Button>

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DropdownMenuItem 
            onClick={onEdit}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <Edit className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
            Edit Form
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={onShare}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <Share2 className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
            Share Form
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={onExport}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
            Export Data
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
            Delete Form
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 