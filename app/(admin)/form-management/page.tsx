import FormManagementTable from "@/components/form-management/form-management-table";
import TopPart from "@/components/form-management/top-part";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";
import { Form } from "@prisma/client";

export default async function page() {
  const queryClient = new QueryClient();

  console.log(
    "******************************",
    process.env.NEXT_PUBLIC_BASE_URL,
    "&&&&&&&&&&&&&&&&&&&&&&&&"
  );

  await queryClient.prefetchQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const res = await betterFetch<Form[]>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/forms/get`
      );
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-12">
        <TopPart />
        <FormManagementTable />
      </div>
    </HydrationBoundary>
  );
}
