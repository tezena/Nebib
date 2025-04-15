"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { toast } from "sonner";

const publishSchema = z.object({
  accessCode: z.string().optional(),
  shareSetting: z.enum(["public", "private"]),
  responseDraft: z.string().optional(),
});

type PublishData = z.infer<typeof publishSchema>;

export default function PublishStep() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("setting");
  const [publishData, setPublishData] = useState<PublishData>(() => {
    if (typeof window !== "undefined") {
      return (
        JSON.parse(localStorage.getItem("publish_data") || "null") || {
          shareSetting: "private",
          responseDraft: "",
          accessCode: "",
        }
      );
    }
    return { shareSetting: "private", responseDraft: "", accessCode: "" };
  });

  const handlePublishChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPublishData((prev) => ({ ...prev, [name]: value }));
  };

  const saveToDatabase = async () => {
    const formData = JSON.parse(localStorage.getItem("form_data") || "null");
    try {
      setIsLoading(true);
      const response = await fetch("/api/forms", {
        method: "POST",
        body: JSON.stringify({ formData, publishData }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to publish form.");
      }
      toast.success("Form Published Successfully");
      // localStorage.removeItem("form_data");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Publish</h2>
      <p className="text-sm text-gray-500 mb-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam
      </p>

      <div className="grid grid-cols-2 gap-2 bg-gray-200 p-2 rounded-md mb-6">
        <Button
          variant={activeTab === "setting" ? "default" : "secondary"}
          className={`w-full hover:bg-[#7ba2cf] ${
            activeTab === "setting"
              ? "bg-[#4A90E2] hover:bg-[#4A90E2] text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setActiveTab("setting")}
        >
          Setting
        </Button>
        <Button
          className={`w-full hover:bg-[#7ba2cf] ${
            activeTab === "preview"
              ? "bg-[#4A90E2] hover:bg-[#4A90E2] text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </Button>
      </div>
      {activeTab === "setting" && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Share setting</h3>

            <RadioGroup
              value={publishData.shareSetting}
              onValueChange={(value: "public" | "private") =>
                setPublishData((prev) => ({ ...prev, shareSetting: value }))
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">
                  Public - anyone with a link can access
                </Label>
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
            <h3 className="font-medium">Submission Handling</h3>

            <div className="bg-gray-100 p-4 rounded-md text-sm">
              <p>
                Automatic Endpoint Generation: When you publish this form, a
                secure endpoint will be automatically created to handle
                submissions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Response Draft</h3>

            <Textarea
              name="responseDraft"
              value={publishData.responseDraft}
              onChange={handlePublishChange}
              placeholder="Enter response after form submission"
              className="min-h-[100px]"
            />
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="border rounded-md p-4 min-h-[300px] flex items-center justify-center text-gray-500">
          Form preview will be displayed here
        </div>
      )}

      <div className="pt-4 flex justify-between">
        <Button
          className="bg-[#4A90E2] hover:bg-[#4A90E2]"
          onClick={saveToDatabase}
          disabled={isLoading}
        >
          {isLoading ? "Publishing" : "Publish"}
        </Button>
        <Button className="bg-[#4A90E2] hover:bg-[#4A90E2]">
          Back: Review
        </Button>
      </div>
    </div>
  );
}
