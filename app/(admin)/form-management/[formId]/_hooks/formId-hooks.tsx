import type { Form, Field } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { betterFetch } from "@better-fetch/fetch"

// Define the complete form type with fields included
export interface FormWithFields extends Form {
  fields: Field[]
  datas?: any[]
}

const getForm = async (formId: string): Promise<FormWithFields[]> => {
  console.log("🔗 Hook: Fetching form with ID:", formId)

  try {
    // Updated to use lowercase formid to match the API route
    const res = await betterFetch<FormWithFields[]>(`/api/forms/${formId}`)
    console.log("📡 Hook: API response:", res)

    if (res.error) {
      console.error("❌ Hook: API returned error:", res.error)
      throw new Error(res.error.message || "Failed to fetch form")
    }

    return res.data || []
  } catch (error) {
    console.error("🚨 Hook: Fetch error:", error)
    throw error
  }
}

export const useGetForm = (formId: string) => {
  return useQuery({
    queryKey: ["form", formId],
    queryFn: () => getForm(formId),
    enabled: !!formId,
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retry
  })
}

export interface RenderedForm extends Form {
  fields: Array<{
    id: string
    label: string
    type: string
    required: boolean
    category?: string
  }>
}

// Updated to use formId instead of link
const getPublicForm = async (formId: string) => {
  console.log("🔗 Hook: Fetching public form with ID:", formId)

  try {
    // Updated to use lowercase formid to match the API route
    const res = await betterFetch<RenderedForm>(`/api/forms/${formId}/public`)
    console.log("📡 Hook: Public form response:", res)

    if (res.error) {
      console.error("❌ Hook: Public form API returned error:", res.error)
      throw new Error(res.error.message || "Failed to fetch public form")
    }

    return res.data
  } catch (error) {
    console.error("🚨 Hook: Public form fetch error:", error)
    throw error
  }
}

export const useGetPublicForm = (formId: string) => {
  return useQuery({
    queryKey: ["public-form", formId],
    queryFn: () => getPublicForm(formId),
    enabled: !!formId,
    retry: 1,
    retryDelay: 1000,
  })
}

// Keep the old one for backward compatibility if needed
const getRenderedForm = async (link: string) => {
  const res = await betterFetch<RenderedForm[]>(`/api/forms/link/${link}`)
  console.log("Rendered form response: ", res)
  return res.data
}

export const useGetRenderedForm = (link: string) => {
  return useQuery({
    queryKey: ["rendered-form", link],
    queryFn: () => getRenderedForm(link),
    enabled: !!link,
  })
}
