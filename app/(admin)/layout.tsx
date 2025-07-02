import AppSidebar from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopPart from "@/components/ui/top-part";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex flex-col w-full">
        <TopPart />
        <main className="bg-[#E1E8ED]  grid grid-cols-1  sm:p-1 transition-all duration-300 ease-in-out">
          <div className="h-full rounded-md  ">
            <div className="p-2">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
