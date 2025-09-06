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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Send, CheckCircle, AlertCircle } from "lucide-react"
import { useAddData } from "@/app/(admin)/form-management/_hooks/form_hooks"
import { toast } from "sonner"
import QRGenerator from "@/components/qr-code/qr-generator"

export default function PublicFormRenderer() {
  const params = useParams()
  const formId = params?.formId as string
  const { data: form, isPending, error } = useGetPublicForm(formId)

  console.log("Public form data:", form)

  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)

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

      const result = await addData({
        datas: JSON.parse(JSON.stringify(formValues)),
        formId: form.id,
      })

      // Store submitted data for QR code generation
      setSubmittedData({
        formValues,
        formId: form.id,
        submissionId: (result as any)?.id || Date.now().toString()
      })
      
      setIsSubmitted(true)
      toast.success("Form submitted successfully! Your QR code is ready.")
    } catch (error) {
      console.error("Failed to ቅስ ያስገቡ", error)
      toast.error("Failed to ቅስ ያስገቡ")
    }
  }

  // Render different field types
  const renderField = (field: any) => {
    const { id, label, type, required } = field

    switch (type) {
      case "text":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="text"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        )

      case "number":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="number"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        )

      case "email":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="email"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        )

      case "date":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="date"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={id}
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        )

      case "select":
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={formValues[id] || ""} onValueChange={(value) => handleInputChange(id, value)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400">
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2" key={id}>
            <Checkbox
              id={id}
              checked={formValues[id] || false}
              onCheckedChange={(checked) => handleInputChange(id, checked)}
              required={required}
              className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 dark:data-[state=checked]:border-blue-500"
            />
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        )

      default:
        return (
          <div className="space-y-2" key={id}>
            <Label htmlFor={id} className="text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="text"
              value={formValues[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              required={required}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        )
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading form...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-2">Error loading form</p>
          <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Form not found</p>
        </div>
      </div>
    )
  }

  if (isSubmitted && submittedData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-6 sm:p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Form Submitted Successfully!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your QR code has been generated. You can download it below.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <QRGenerator
                  userId={submittedData.submissionId}
                  formId={submittedData.formId}
                  formData={submittedData.formValues}
                  className="border-0 shadow-none"
                />
              </div>
              
              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setSubmittedData(null)
                  setFormValues({})
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Submit Another Response
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="p-6 sm:p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                  Powered by ፍሬ Form
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {form.topic}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                {form.description}
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field: any) => renderField(field))}

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      ቅስ ያስገቡ
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
