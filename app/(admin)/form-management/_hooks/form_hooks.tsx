import type { Form, Data } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const getForms = async () => {
  console.log("Fetching forms...")

  try {
    const response = await fetch("/api/forms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch forms");
    }

    const data = await response.json();
    console.log("Forms response: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  }
}

export const useGetForms = () => {
  return useQuery({
    queryKey: ["forms"],
    queryFn: () => getForms(),
    retry: 3,
    retryDelay: 1000,
  })
}

const addData = async (data: { datas: JSON; formId: string }) => {
  console.log("Adding data:", data)

  try {
    const response = await fetch("/api/submission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        data: data.datas,
        formId: data.formId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add data");
    }

    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error("Error adding data:", error);
    throw error;
  }
}

export const useAddData = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { datas: JSON; formId: string }) => addData(data),
    onSuccess: () => {
      console.log("invalidating queries")
      queryClient.invalidateQueries({ queryKey: ["datas"] })
      queryClient.invalidateQueries({ queryKey: ["forms"] })
    },
  })
}

const deleteForm = async (formId: string) => {
  console.log("Deleting form:", formId);

  const response = await fetch(`/api/forms/${formId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete form");
  }

  const data = await response.json();
  return data;
}

export const useDeleteForm = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formId: string) => deleteForm(formId),
    onSuccess: () => {
      console.log("Form deleted, invalidating queries")
      queryClient.invalidateQueries({ queryKey: ["forms"] })
    },
  })
}
