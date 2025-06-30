"use client"

import { useParams } from "next/navigation"
import { useGetForm, type FormWithFields } from "./_hooks/formId-hooks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Copy, ExternalLink, Users, Calendar, Lock } from "lucide-react"
import { toast } from "sonner"
import { LinkIcon } from "lucide-react"

export default function FormDetailPage() {
  const params = useParams()
  const formId = params?.formId as string
  const { data: form, isPending, error } = useGetForm(formId)

  const copyLink = () => {
    if (form && form[0]) {
      const publicLink = `${window.location.origin}/form/${form[0].id}`
      navigator.clipboard
        .writeText(publicLink)
        .then(() => {
          toast.success("Form link copied to clipboard!")
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err)
          toast.error("Failed to copy link")
        })
    }
  }

  const openFormLink = () => {
    if (form && form[0]) {
      const publicLink = `${window.location.origin}/form/${form[0].id}`
      window.open(publicLink, "_blank")
    }
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading form details...</span>
      </div>
    )
  }

  if (error || !form || !form[0]) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl border rounded-md p-8">
          <h1 className="text-xl text-red-500">Form Not Found</h1>
          <p>The form you're looking for doesn't exist.</p>
        </Card>
      </div>
    )
  }

  const formData: FormWithFields = form[0]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{formData.topic}</h1>
              <p className="text-gray-600">{formData.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {formData.status || "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Form Type</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <span className="text-lg font-semibold">{formData.type || "Private"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formData.submissions || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{new Date(formData.createdAt).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Form Link Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Form Link</CardTitle>
            <CardDescription>Share this link to collect responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 bg-muted rounded-md">
              <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium flex-1">{formData.id}</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={copyLink}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={openFormLink}
                className="flex items-center space-x-2 px-4 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#3a7bc8] transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Form</span>
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Public URL:</strong> {window.location.origin}/form/{formData.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Fields Section */}
        <Card>
          <CardHeader>
            <CardTitle>Form Fields</CardTitle>
            <p className="text-sm text-gray-600">Fields configured for this form</p>
          </CardHeader>
          <CardContent>
            {formData.fields && formData.fields.length > 0 ? (
              <div className="space-y-3">
                {formData.fields.map((field, index) => (
                  <div key={field.id || index} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <span className="font-medium">{field.label}</span>
                      <span className="ml-2 text-sm text-gray-500">({field.type})</span>
                      {field.required && <span className="ml-1 text-red-500">*</span>}
                    </div>
                    {field.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{field.category}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No fields configured for this form.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
