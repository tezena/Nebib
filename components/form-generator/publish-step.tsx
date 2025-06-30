"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { toast } from "sonner"
import FormPreview from "./form-preview"
import { ArrowLeft, Copy, ExternalLink } from "lucide-react"

const publishSchema = z.object({
  accessCode: z.string().optional(),
  shareSetting: z.enum(["public", "private"]),
  responseDraft: z.string().optional(),
})

type PublishData = z.infer<typeof publishSchema>

interface PublishStepProps {
  setCurrentStep: (arg0: number) => void
}

export default function PublishStep({ setCurrentStep }: PublishStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("setting")
  const [publishedFormId, setPublishedFormId] = useState<string | null>(null)
  const [publishData, setPublishData] = useState<PublishData>(() => {
    if (typeof window !== "undefined") {
      return (
        JSON.parse(localStorage.getItem("publish_data") || "null") || {
          shareSetting: "private",
          responseDraft: "",
          accessCode: "",
        }
      )
    }
    return { shareSetting: "private", responseDraft: "", accessCode: "" }
  })

  const handlePublishChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPublishData((prev) => ({ ...prev, [name]: value }))
  }

  const saveToDatabase = async () => {
    const formData = JSON.parse(localStorage.getItem("form_data") || "null")
    try {
      setIsLoading(true)
      const response = await fetch("/api/forms", {
        method: "POST",
        body: JSON.stringify({ formData, publishData }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error)
      }

      setPublishedFormId(data.id)
      toast.success("Form published successfully!")

      // Store the published form ID
      localStorage.setItem("published_form_id", data.id)
    } catch (error: any) {
      toast.error("Error publishing form")
    } finally {
      setIsLoading(false)
    }
  }

  const copyPublicLink = () => {
    if (publishedFormId) {
      const publicLink = `${window.location.origin}/form/${publishedFormId}`
      navigator.clipboard.writeText(publicLink)
      toast.success("Public link copied to clipboard!")
    }
  }

  const openPublicLink = () => {
    if (publishedFormId) {
      const publicLink = `${window.location.origin}/form/${publishedFormId}`
      window.open(publicLink, "_blank")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Publish</h2>
      <p className="text-sm text-gray-500 mb-6">
        Configure your form settings and publish it to make it accessible to users.
      </p>

      <div className="grid grid-cols-2 gap-2 bg-gray-200 p-2 rounded-md mb-6">
        <Button
          variant={activeTab === "setting" ? "default" : "secondary"}
          className={`w-full hover:bg-[#7ba2cf] ${
            activeTab === "setting" ? "bg-[#4A90E2] hover:bg-[#4A90E2] text-white" : "bg-gray-300 text-black"
          }`}
          onClick={() => setActiveTab("setting")}
        >
          Settings
        </Button>
        <Button
          className={`w-full hover:bg-[#7ba2cf] ${
            activeTab === "preview" ? "bg-[#4A90E2] hover:bg-[#4A90E2] text-white" : "bg-gray-300 text-black"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </Button>
      </div>

      {activeTab === "setting" && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Share Settings</h3>

            <RadioGroup
              value={publishData.shareSetting}
              onValueChange={(value: "public" | "private") =>
                setPublishData((prev) => ({ ...prev, shareSetting: value }))
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Public - anyone with the link can access</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Private - requires access code</Label>
              </div>
            </RadioGroup>

            {publishData.shareSetting === "private" && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="accessCode">Access Code</Label>
                <Input
                  id="accessCode"
                  name="accessCode"
                  placeholder="Enter form access code"
                  value={publishData.accessCode}
                  onChange={handlePublishChange}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Response Message</h3>
            <Textarea
              name="responseDraft"
              value={publishData.responseDraft}
              onChange={handlePublishChange}
              placeholder="Enter message to show after form submission (optional)"
              className="min-h-[100px]"
            />
          </div>

          {publishedFormId && (
            <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-medium text-green-800">Form Published Successfully!</h3>
              <div className="space-y-2">
                <Label>Public Link:</Label>
                <div className="flex items-center space-x-2">
                  <Input value={`${window.location.origin}/form/${publishedFormId}`} readOnly className="bg-white" />
                  <Button type="button" size="sm" onClick={copyPublicLink} className="bg-green-600 hover:bg-green-700">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" onClick={openPublicLink} className="bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "preview" && (
        <div className="border rounded-md p-4 min-h-[300px]">
          <FormPreview />
        </div>
      )}

      <div className="pt-4 flex justify-between">
        <Button className="bg-[#4A90E2] hover:bg-[#4A90E2]" onClick={() => setCurrentStep(1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button className="bg-[#4A90E2] hover:bg-[#4A90E2]" onClick={saveToDatabase} disabled={isLoading}>
          {isLoading ? "Publishing..." : publishedFormId ? "Update Form" : "Publish Form"}
        </Button>
      </div>
    </div>
  )
}
