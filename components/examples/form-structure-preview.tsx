"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Calendar, Mail, Hash, CheckSquare } from "lucide-react";

interface FormField {
  label: string;
  type: string;
  required: boolean;
}

interface FormStructurePreviewProps {
  fields: FormField[];
  title: string;
  description: string;
}

export default function FormStructurePreview({ fields, title, description }: FormStructurePreviewProps) {
  const getFieldIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="w-4 h-4 text-gray-400" />;
      case "email":
        return <Mail className="w-4 h-4 text-gray-400" />;
      case "number":
        return <Hash className="w-4 h-4 text-gray-400" />;
      case "date":
        return <Calendar className="w-4 h-4 text-gray-400" />;
      case "checkbox":
        return <CheckSquare className="w-4 h-4 text-gray-400" />;
      case "textarea":
        return <FileText className="w-4 h-4 text-gray-400" />;
      case "file":
        return <FileText className="w-4 h-4 text-gray-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderFieldPreview = (field: FormField, index: number) => {
    const { label, type, required } = field;

    return (
      <div key={index} className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          {getFieldIcon(type)}
          <Label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Badge variant="outline" className="text-xs ml-auto">
            {type}
          </Badge>
        </div>
        
        <div className="opacity-60">
          {type === "text" && (
            <Input
              placeholder={`Enter ${label.toLowerCase()}`}
              disabled
              className="bg-white"
            />
          )}
          {type === "email" && (
            <Input
              type="email"
              placeholder="Enter your email"
              disabled
              className="bg-white"
            />
          )}
          {type === "number" && (
            <Input
              type="number"
              placeholder={`Enter ${label.toLowerCase()}`}
              disabled
              className="bg-white"
            />
          )}
          {type === "date" && (
            <Input
              type="date"
              disabled
              className="bg-white"
            />
          )}
          {type === "textarea" && (
            <Textarea
              placeholder={`Enter ${label.toLowerCase()}`}
              disabled
              className="bg-white min-h-[80px]"
            />
          )}
          {type === "file" && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">Click to upload file</p>
            </div>
          )}
          {type === "checkbox" && (
            <div className="flex items-center space-x-2">
              <Checkbox disabled />
              <Label className="text-sm text-gray-600">{label}</Label>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="border border-gray-200 bg-white/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        
        <div className="space-y-3">
          {fields.map((field, index) => renderFieldPreview(field, index))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{fields.length} fields</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
              Preview Mode
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 