"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

const fieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: z.enum(["text", "number", "email", "date", "checkbox"]),
  category: z.string(),
  required: z.boolean(),
});

export const formSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  fields: z.array(fieldSchema),
});

type Field = z.infer<typeof fieldSchema>;
type FormData = z.infer<typeof formSchema>;

export default function FormPreview() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = JSON.parse(
        localStorage.getItem("form_data") || "null"
      );
      if (storedData) {
        setFormData(storedData);

        // Initialize form values
        const initialValues: Record<string, any> = {};
        storedData.fields?.forEach((field: Field) => {
          initialValues[field.label] = field.type === "checkbox" ? false : "";
        });
        setFormValues(initialValues);
      }
    }
  }, []);

  const handleInputChange = (fieldLabel: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      alert("Form submitted successfully!");

      // Get response draft from publish data
      const publishData = JSON.parse(
        localStorage.getItem("publish_data") || "null"
      );
      if (publishData?.responseDraft) {
        alert(`Response: ${publishData.responseDraft}`);
      }
    }, 1000);
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        No form data available
      </div>
    );
  }

  return (
    <div className="border rounded-md p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{formData.topic}</h2>
        <p className="text-gray-600">{formData.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formData.fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`field-${index}`} className="flex items-center">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {field.type === "text" && (
              <Input
                id={`field-${index}`}
                type="text"
                value={formValues[field.label] || ""}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
                required={field.required}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}

            {field.type === "number" && (
              <Input
                id={`field-${index}`}
                type="number"
                value={formValues[field.label] || ""}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
                required={field.required}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}

            {field.type === "email" && (
              <Input
                id={`field-${index}`}
                type="email"
                value={formValues[field.label] || ""}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
                required={field.required}
                placeholder={`Enter your email`}
              />
            )}

            {field.type === "date" && (
              <Input
                id={`field-${index}`}
                type="date"
                value={formValues[field.label] || ""}
                onChange={(e) => handleInputChange(field.label, e.target.value)}
                required={field.required}
              />
            )}

            {field.type === "checkbox" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`field-${index}`}
                  checked={formValues[field.label] || false}
                  onCheckedChange={(checked) =>
                    handleInputChange(field.label, checked)
                  }
                  required={field.required}
                />
                <label
                  htmlFor={`field-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Yes
                </label>
              </div>
            )}

            {field.category && (
              <div className="text-xs text-gray-500">
                Category: {field.category}
              </div>
            )}
          </div>
        ))}

        <Button
          type="submit"
          className="bg-[#4A90E2] hover:bg-[#7ba2cf] w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Form"}
        </Button>
      </form>
    </div>
  );
}
