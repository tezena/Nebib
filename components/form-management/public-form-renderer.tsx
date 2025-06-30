"use client"

import type React from "react"
import { useState } from "react"
import { useParams } from "next/navigation"
import { useGetPublicForm } from "@/app/(admin)/form-management/[formId]/_hooks/formId-hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { useAddData } from "@/app/(admin)/form-management/_hooks/form_hooks"
import { toast } from "sonner"

export default function PublicFormRenderer() {
  const params = useParams()
  const formId = params?.formId as string
  const { data: form, isPending, error } = useGetPublicForm(formId)

  console.log("Public form data:", form)

  const [formValues, setFormValues] = useState<Record<string, any>>({})

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const { mutate: addData, error: submissionError, isPending: isSubmitting } = useAddData()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form) return

    // Validate required fields
    const missingRequiredFields = form.fields
      .filter((field: any) => field.required)
      .filter((field: any) => !formValues[field.id] && formValues[field.id] !== false)

    if (missingRequiredFields.length > 0) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      console.log("Submitting with form values:", formValues)

      await addData({
        datas: JSON.parse(JSON.stringify(formValues)),
        formId: form.id,
      })

      toast.success("Form submitted successfully!")
      setFormValues({})
    } catch (error) {
      console.error("Failed to submit form", error)
      toast.error("Failed to submit form")
    }
  }

  // Render different field types
  const renderField = (field: any) => {
    const { id, label, type, required } = field

    switch (type) {
      case "text":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        )

      case "number":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              type="number"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        )

      case "email":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              type="email"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        )

      case "date":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              type="date"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-2" key={id}>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={formValues[id] || false}
                onCheckedChange={(checked) => handleInputChange(id, checked)}
                required={required}
              />
              <Label htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
              </Label>
            </div>
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        )

      default:
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
            />
          </div>
        )
    }
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading form...</span>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl border rounded-md p-8">
          <h1 className="text-xl text-red-500">Form Not Found</h1>
          <p>The form you're looking for doesn't exist or has been removed.</p>
        </Card>
      </div>
    )
  }

  // Group fields by category
  const groupedFields: Record<string, any[]> = {}
  const uncategorizedFields: any[] = []

  form.fields.forEach((field: any) => {
    if (field.category) {
      if (!groupedFields[field.category]) {
        groupedFields[field.category] = []
      }
      groupedFields[field.category].push(field)
    } else {
      uncategorizedFields.push(field)
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <img src="/images/logo.svg" className="h-10 w-10" alt="Logo" />
            <span className="ml-2 text-2xl font-bold text-blue-500">Nebib</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="w-full border rounded-lg p-8 bg-white shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.topic}</h1>
            <p className="text-gray-600 text-lg">{form.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Render categorized fields */}
            {Object.entries(groupedFields).map(([category, fields]) => (
              <div key={category} className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">{category}</h2>
                <div className="grid gap-6">{fields.map((field) => renderField(field))}</div>
              </div>
            ))}

            {/* Render uncategorized fields */}
            {uncategorizedFields.length > 0 && (
              <div className="space-y-6">
                <div className="grid gap-6">{uncategorizedFields.map((field) => renderField(field))}</div>
              </div>
            )}

            <div className="pt-6 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Form"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/images/logo.svg" alt="Nebib Logo" className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">Nebib</span>
          </div>
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Nebib. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
