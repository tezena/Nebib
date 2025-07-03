import type { Form, Field } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { betterFetch } from "@better-fetch/fetch"

// Define the complete form type with fields included
export interface FormWithFields extends Form {
  shareSetting: string
  fields: Field[]
  datas?: any[]
}

const getForm = async (formId: string): Promise<FormWithFields[]> => {
  console.log("🔗 Hook: Fetching form with ID:", formId)

  try {
    // Use the correct API route that matches our backend
    const url = `/api/forms/${formId}`
    console.log("🔗 Hook: Making request to:", url)

    const res = await betterFetch<FormWithFields[]>(url)
    console.log("📡 Hook: Full API response:", res)
    console.log("📡 Hook: Response data:", res.data)
    console.log("📡 Hook: Response error:", res.error)

    if (res.error) {
      console.error("❌ Hook: API returned error:", res.error)
      // Provide more detailed error information
      const errorMessage = res.error.message || JSON.stringify(res.error) || "Failed to fetch form"
      throw new Error(errorMessage)
    }

    if (!res.data) {
      console.error("❌ Hook: No data returned from API")
      throw new Error("No data returned from API")
    }

    console.log("✅ Hook: Successfully fetched form data")
    return res.data
  } catch (error) {
    console.error("🚨 Hook: Fetch error:", error)

    // If it's already an Error, re-throw it
    if (error instanceof Error) {
      throw error
    }

    // Otherwise, create a new Error with more context
    throw new Error(`Failed to fetch form: ${JSON.stringify(error)}`)
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
    const url = `/api/forms/${formId}/public`
    console.log("🔗 Hook: Making public request to:", url)

    const res = await betterFetch<RenderedForm>(url)
    console.log("📡 Hook: Public form response:", res)

    if (res.error) {
      console.error("❌ Hook: Public form API returned error:", res.error)
      const errorMessage = res.error.message || JSON.stringify(res.error) || "Failed to fetch public form"
      throw new Error(errorMessage)
    }

    return res.data
  } catch (error) {
    console.error("🚨 Hook: Public form fetch error:", error)

    if (error instanceof Error) {
      throw error
    }

    throw new Error(`Failed to fetch public form: ${JSON.stringify(error)}`)
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
