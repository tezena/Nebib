import { useQuery } from "@tanstack/react-query";

interface Form {
  id: string;
  topic: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  submissions: number;
  type: 'Public' | 'Private';
  fields: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
  }>;
  datas?: Array<{
    id: string;
    data: any;
    createdAt: string;
  }>;
}

const getForms = async (): Promise<Form[]> => {
  try {
    console.log("🔍 Dashboard: Fetching forms...");
    const response = await fetch("/api/forms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
    });
    
    console.log("📊 Dashboard: Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Dashboard: API error:", errorData);
      throw new Error(errorData.error || "Failed to fetch forms");
    }
    
    const data = await response.json();
    console.log("✅ Dashboard: Forms fetched successfully:", data.length);
    return data || [];
  } catch (error) {
    console.error("🚨 Dashboard: Fetch error:", error);
    throw error;
  }
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["forms"],
    queryFn: getForms,
    retry: 3,
    retryDelay: 1000,
  });
}; 