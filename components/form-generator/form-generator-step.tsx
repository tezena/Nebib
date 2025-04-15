"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "../ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

// Zod Schema for Form Fields
const fieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: z.enum(["text", "number", "email", "date", "checkbox"]),
  category: z.string(),
  required: z.boolean(),
});

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  fields: z.array(fieldSchema),
});

type Field = z.infer<typeof fieldSchema>;
type FormData = z.infer<typeof formSchema>;

export default function FormGeneratorStep() {
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const storedData = JSON.parse(
        localStorage.getItem("form_data") || "null"
      );
      return storedData
        ? {
            topic: storedData.topic || "",
            description: storedData.description || "",
            categories: Array.isArray(storedData.categories)
              ? storedData.categories
              : [],
            fields: storedData.fields || [],
          }
        : {
            topic: "",
            description: "",
            categories: [],
            fields: [],
          };
    }
    return { topic: "", description: "", categories: [], fields: [] };
  });

  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    localStorage.setItem("form_data", JSON.stringify(formData));
  }, [formData]);

  const addField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        { label: "", type: "text", category: "", required: false },
      ],
    }));
  };

  const addCategory = () => {
    if (!newCategory.trim() || formData.categories.includes(newCategory.trim()))
      return;
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory.trim()],
    }));
    setNewCategory("");
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
      // Also remove this category from any fields that were using it
      fields: prev.fields.map((field) =>
        field.category === categoryToRemove ? { ...field, category: "" } : field
      ),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Form Generator</h2>

      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Textarea
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className="max-w-[400px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="max-w-[400px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="flex items-center gap-2">
          {/* Display categories as tags */}
          <div className="flex flex-wrap gap-2">
            {formData.categories.map((category) => (
              <div
                key={category}
                className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {category}
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Category input with plus button */}
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Enter new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              className="flex-1 max-w-[400px]"
            />
            <Button
              type="button"
              size="icon"
              onClick={addCategory}
              disabled={!newCategory.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Button onClick={addField} className="bg-[#4A90E2] hover:bg-[#4A90E2]">
          Add Field
        </Button>
      </div>

      {formData.fields.map((field, index) => (
        <div key={index} className="space-y-2">
          <Label>Field {index + 1}</Label>
          <Input
            placeholder="Label"
            value={field.label}
            onChange={(e) => {
              const newFields = [...formData.fields];
              newFields[index].label = e.target.value;
              setFormData((prev) => ({ ...prev, fields: newFields }));
            }}
            className="max-w-[400px]"
          />
          <Select
            value={field.type}
            onValueChange={(value) => {
              const newFields = [...formData.fields];
              newFields[index].type = value as Field["type"];
              setFormData((prev) => ({ ...prev, fields: newFields }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select field type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={field.category}
            onValueChange={(value) => {
              const newFields = [...formData.fields];
              newFields[index].category = value;
              setFormData((prev) => ({ ...prev, fields: newFields }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {formData.categories.map((category, idx) => (
                <SelectItem key={idx} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Switch
              checked={field.required}
              onCheckedChange={(checked) => {
                const newFields = [...formData.fields];
                newFields[index].required = checked;
                setFormData((prev) => ({ ...prev, fields: newFields }));
              }}
              className="data-[state=checked]:bg-[#4A90E2]"
            />
            <Label>Required</Label>
          </div>
        </div>
      ))}
    </div>
  );
}
