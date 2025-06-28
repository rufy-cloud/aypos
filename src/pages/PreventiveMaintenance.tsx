import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";

const PreventiveMaintenance = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 bg-[#f8f8f8] overflow-auto p-6">
            {/* Header Card */}
            <div className="max-w-5xl mx-auto">
              <Card className="mb-8 rounded-xl shadow-md px-6 py-4 flex items-center justify-center">
                <h1 className="text-2xl font-bold text-[#22314d] font-montserrat text-center">
                  Preventive Maintenance
                </h1>
              </Card>

              {/* Chart Card */}
              <Card className="rounded-xl shadow-md px-6 py-8 min-h-[400px] flex items-center justify-center">
                {/* Placeholder for chart */}
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span className="text-[#5e6e7b] text-lg font-montserrat text-center">
                    [Chart will appear here]
                  </span>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PreventiveMaintenance;
