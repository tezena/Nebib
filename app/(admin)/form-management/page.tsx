import FormManagementTable from "@/components/form-management/form-management-table";
import TopPart from "@/components/form-management/top-part";
import MobileNavigation from "@/components/form-management/mobile-navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";
import { Form } from "@prisma/client";

export default async function page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const res = await betterFetch<Form[]>(
        `/api/forms`
      );
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen pb-20 md:pb-8" style={{ backgroundColor: '#f7f7f7' }}>
        {/* Mobile Header */}
        <div className="md:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold" style={{ color: '#382606' }}>ቅጾች</h1>
                <p className="text-xs" style={{ color: '#382606', opacity: 0.7 }}>የታተሙ ቅጾችዎን ያስተዳድሩ</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full" style={{ backgroundColor: '#f4be42', opacity: 0.2 }}>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f4be42' }}></div>
                    <span className="text-xs font-medium" style={{ color: '#382606' }}>ቀጥተኛ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Desktop Header */}
          <div className="hidden md:block">
            <TopPart />
          </div>

          {/* Mobile Stats */}
          <div className="md:hidden mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#382606', opacity: 0.7 }}>ጠቅላላ ቅጾች</p>
                    <p className="text-lg font-bold" style={{ color: '#382606' }}>-</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f4be42', opacity: 0.2 }}>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f4be42' }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#382606', opacity: 0.7 }}>ንቁ</p>
                    <p className="text-lg font-bold" style={{ color: '#382606' }}>-</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f4be42', opacity: 0.2 }}>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f4be42' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mb-6">
            <MobileNavigation />
          </div>

          <div className="mt-4 sm:mt-8">
            <FormManagementTable />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
