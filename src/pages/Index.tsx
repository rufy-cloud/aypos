
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <MainContent />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
