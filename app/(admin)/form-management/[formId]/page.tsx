"use client";

import { useParams, useRouter } from "next/navigation";
import { RenderedForm, useGetForm } from "./_hooks/formId-hooks";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton2";
import {
  CalendarIcon,
  Link,
  LinkIcon,
  PersonStanding,
  Users2Icon,
} from "lucide-react";
import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface FormData {
  id: string;
  topic: string;
  description: string;
  status: string;
  type: string;
  submissions: number;
  createdAt: string;
  link: string;
  fields: {
    id: string;
    label: string;
    type: string;
    required: boolean;
    category?: string;
  }[];
}

const getForm = async (formId: string): Promise<FormData> => {
  const res = await betterFetch<FormData>(`/api/forms/${formId}`);
  console.log("response: ", res);
  if (!res.data) {
    throw new Error("Failed to fetch form data");
  }
  return res.data;
};

export default function FormIdPage() {
  const params = useParams();
  const formId = params?.formId;
  const router = useRouter();

  if (!formId) {
    return <div>Error: Form ID is missing</div>;
  }

  const { data, isLoading, error } = useQuery<FormData>({
    queryFn: () => getForm(formId as string),
    queryKey: ["form", formId],
  });

  const copyLink = () => {
    if (data?.link) {
      navigator.clipboard
        .writeText(`http://localhost:3000/forms/${data.link}`)
        .then(() => {
          alert("Text copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold text-red-500">Error loading form</h2>
        <p className="text-muted-foreground">
          {error.message || "Failed to load form details"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {isLoading ? (
        <FormSkeleton />
      ) : data ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold uppercase text-[#4A90E2]">
                {data.topic}
              </h1>
              <p className="text-muted-foreground mt-1">{data.description}</p>
            </div>

            <Badge
              variant={data.status === "active" ? "default" : "secondary"}
              className="px-3 py-1 bg-[#4A90E2]"
            >
              {data.status}
            </Badge>
          </div>

          <div className="my-8">
            <button
              onClick={() => {
                router.push(`/attendance-management/${formId}`);
              }}
              className="flex items-center px-4 py-3 font-bold text-lg rounded-md 
            bg-blue-500 text-white"
            >
              <PersonStanding />
              <span className="ml-3">Attendance Management</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Form Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users2Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{data.type}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.submissions || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {data.createdAt
                      ? new Date(data.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Form Link</CardTitle>
              <CardDescription>
                Share this link to collect responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center p-3 bg-muted rounded-md">
                <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span
                  className="text-sm font-medium cursor-pointer"
                  onClick={copyLink}
                >
                  {data.link}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
              <CardDescription>
                Fields that respondents will see
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.fields && data.fields.length > 0 ? (
                <div className="space-y-4">
                  {data.fields.map((field) => (
                    <div key={field.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{field.label}</h3>
                          <p className="text-sm text-muted-foreground">
                            Type: {field.type}
                          </p>
                        </div>
                        {field.required && (
                          <Badge variant="outline" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      {field.category && (
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">
                            Category: {field.category}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No fields found for this form.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
