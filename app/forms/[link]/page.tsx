"use client";

import type React from "react";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetRenderedForm } from "@/app/(admin)/form-management/[formId]/_hooks/formId-hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function FormLinkPage() {
  const params = useParams();
  console.log(params);
  const link = params?.link as string;
  console.log(link);
  const { data, isPending, error } = useGetRenderedForm(link);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("data : ", data);

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading form...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="max-w-3xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>
            {error?.message ||
              "This form could not be loaded. It may have been removed or the link is invalid."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const form = Array.isArray(data) ? data[0] : data;

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const missingRequiredFields = form.fields
      .filter((field: any) => field.required)
      .filter(
        (field: any) => !formValues[field.id] && formValues[field.id] !== false
      );

    if (missingRequiredFields.length > 0) {
      toast.success("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would implement the actual form submission
      // For example:
      // await fetch(`/api/forms/${form.id}/submit`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ formValues }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Thank you for your submission!");

      // Reset form values
      setFormValues({});
    } catch (error: any) {
      toast.success("Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different field types
  const renderField = (field: any) => {
    const { id, label, type, required } = field;

    switch (type) {
      case "text":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        );

      case "email":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={id}
              type="email"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        );

      case "number":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={id}
              type="number"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              className="min-h-[100px]"
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2" key={id}>
            <Checkbox
              id={id}
              checked={formValues[id] || false}
              onCheckedChange={(checked) => handleInputChange(id, checked)}
              required={required}
            />
            <Label htmlFor={id}>
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
          </div>
        );

      case "radio":
        // For radio buttons, we'd need options which aren't in the current schema
        // This is a simplified version
        return (
          <div className="space-y-2" key={id}>
            <Label>
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup
              value={formValues[id] || ""}
              onValueChange={(value) => handleInputChange(id, value)}
              required={required}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id={`${id}-option1`} />
                <Label htmlFor={`${id}-option1`}>Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id={`${id}-option2`} />
                <Label htmlFor={`${id}-option2`}>Option 2</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case "select":
        // For select, we'd need options which aren't in the current schema
        // This is a simplified version
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Select
              value={formValues[id] || ""}
              onValueChange={(value) => handleInputChange(id, value)}
              required={required}
            >
              <SelectTrigger id={id}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "date":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={id}
              type="date"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        );

      default:
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        );
    }
  };

  // Group fields by category if they have one
  const groupedFields: Record<string, any[]> = {};
  const uncategorizedFields: any[] = [];

  form.fields.forEach((field: any) => {
    if (field.category) {
      if (!groupedFields[field.category]) {
        groupedFields[field.category] = [];
      }
      groupedFields[field.category].push(field);
    } else {
      uncategorizedFields.push(field);
    }
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl capitalize font-extrabold">
            {form.topic}
          </CardTitle>
          <CardDescription className="text-base">
            {form.description}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-12">
            {/* Render categorized fields */}
            {Object.entries(groupedFields).map(([category, fields]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-2xl font-bold border-b pb-2">{category}</h3>
                <div className="space-y-4">
                  {fields.map((field) => renderField(field))}
                </div>
              </div>
            ))}

            {/* Render uncategorized fields */}
            {uncategorizedFields.length > 0 && (
              <div className="space-y-4">
                {uncategorizedFields.map((field) => renderField(field))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
