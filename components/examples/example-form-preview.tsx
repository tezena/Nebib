"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Send, CheckCircle, Mail, Calendar, Users, FileText, MapPin } from "lucide-react";
import { toast } from "sonner";

interface FormField {
  label: string;
  type: string;
  required: boolean;
}

interface ExampleForm {
  id: string;
  title: string;
  description: string;
  category: string;
  fields: FormField[];
  iconName: string;
  color: string;
  submissions: number;
}

interface ExampleFormPreviewProps {
  form: ExampleForm;
  children: React.ReactNode;
}

export default function ExampleFormPreview({ form, children }: ExampleFormPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (fieldLabel: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const missingRequiredFields = form.fields
      .filter((field) => field.required)
      .filter((field) => !formValues[field.label] && formValues[field.label] !== false);

    if (missingRequiredFields.length > 0) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Form submitted successfully! This is a demo form.");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormValues({});
      }, 3000);
    }, 1500);
  };

  const resetForm = () => {
    setFormValues({});
    setIsSubmitted(false);
  };

  const renderField = (field: FormField, index: number) => {
    const { label, type, required } = field;

    switch (type) {
      case "text":
        return (
          <div className="space-y-2" key={index}>
            <Label htmlFor={`field-${index}`} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`field-${index}`}
              type="text"
              value={formValues[label] || ""}
              onChange={(e) => handleInputChange(label, e.target.value)}
              required={required}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="w-full"
            />
          </div>
        );

      case "email":
        return (
          <div className="space-y-2" key={index}>
            <Label htmlFor={`field-${index}`} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`field-${index}`}
              type="email"
              value={formValues[label] || ""}
              onChange={(e) => handleInputChange(label, e.target.value)}
              required={required}
              placeholder="Enter your email"
              className="w-full"
            />
          </div>
        );

      case "number":
        return (
          <div className="space-y-2" key={index}>
            <Label htmlFor={`field-${index}`} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`field-${index}`}
              type="number"
              value={formValues[label] || ""}
              onChange={(e) => handleInputChange(label, e.target.value)}
              required={required}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="w-full"
            />
          </div>
        );

      case "date":
        return (
          <div className="space-y-2" key={index}>
            <Label htmlFor={`field-${index}`} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`field-${index}`}
              type="date"
              value={formValues[label] || ""}
              onChange={(e) => handleInputChange(label, e.target.value)}
              required={required}
              className="w-full"
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2" key={index}>
            <Label htmlFor={`field-${index}`} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={`field-${index}`}
              value={formValues[label] || ""}
              onChange={(e) => handleInputChange(label, e.target.value)}
              required={required}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="w-full min-h-[100px]"
            />
          </div>
        );

      case "file":
        return (
          <div className="space-y-2" key={index}>
            <Label htmlFor={`field-${index}`} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`field-${index}`}
              type="file"
              onChange={(e) => {
                const files = Array.from((e.target as HTMLInputElement).files || []);
                handleInputChange(label, files);
              }}
              required={required}
              className="w-full"
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2" key={index}>
            <Checkbox
              id={`field-${index}`}
              checked={formValues[label] || false}
              onCheckedChange={(checked) => handleInputChange(label, checked)}
              required={required}
            />
            <Label htmlFor={`field-${index}`} className="text-sm font-medium leading-none">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      default:
        return (
          <div className="space-y-2" key={index}>
            <Label htmlFor={`field-${index}`} className="flex items-center">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={`field-${index}`}
              value={formValues[label] || ""}
              onChange={(e) => handleInputChange(label, e.target.value)}
              required={required}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="w-full"
            />
          </div>
        );
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
                          <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${form.color} rounded-lg flex items-center justify-center`}>
                  {form.iconName === "mail" && <Mail className="w-5 h-5 text-white" />}
                  {form.iconName === "calendar" && <Calendar className="w-5 h-5 text-white" />}
                  {form.iconName === "users" && <Users className="w-5 h-5 text-white" />}
                  {form.iconName === "file-text" && <FileText className="w-5 h-5 text-white" />}
                  {form.iconName === "map-pin" && <MapPin className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-800">
                    {form.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {form.category}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {form.submissions.toLocaleString()} submissions
                    </span>
                  </div>
                </div>
              </div>
            <DialogDescription className="text-gray-600 mt-2">
              {form.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Form Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  This is a demo form. In a real scenario, your data would be processed and stored.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={resetForm} variant="outline">
                    Submit Another Response
                  </Button>
                  <Button onClick={() => setIsOpen(false)}>
                    Close Preview
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {form.fields.map((field, index) => renderField(field, index))}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Form
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="px-6"
                  >
                    Reset
                  </Button>
                </div>

                <div className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
                  💡 This is a demo form. Your data will not be stored. Create your own form to collect real submissions.
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 