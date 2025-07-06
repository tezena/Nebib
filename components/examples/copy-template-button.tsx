"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyTemplateButtonProps {
  form: {
    title: string;
    description: string;
    category: string;
    fields: Array<{
      label: string;
      type: string;
      required: boolean;
    }>;
  };
}

export default function CopyTemplateButton({ form }: CopyTemplateButtonProps) {
  const handleCopy = () => {
    // Copy form template to clipboard
    const template = JSON.stringify({
      topic: form.title,
      description: form.description,
      categories: [form.category],
      fields: form.fields.map(field => ({
        label: field.label,
        type: field.type,
        category: form.category,
        required: field.required
      }))
    }, null, 2);
    
    navigator.clipboard.writeText(template);
    toast.success("Template copied to clipboard!");
  };

  return (
    <Button 
      variant="outline" 
      className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
      onClick={handleCopy}
    >
      <Copy className="w-4 h-4 mr-2" />
      Copy Template
    </Button>
  );
} 