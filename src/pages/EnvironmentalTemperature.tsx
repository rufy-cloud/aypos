import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

const EnvironmentalTemperature = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 bg-[#f8f8f8] overflow-auto">
            {/* Header */}
            <div className="bg-white border-b border-[#ebe9f1] px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#22314d] font-montserrat text-center w-full">
                  Environmental Temperature & Power Monitoring (Last 20 Records)
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-8 top-6 text-[#22314d] hover:text-[#028a4a]"
                  aria-label="Refresh"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 max-w-6xl mx-auto">
              {/* Temperature Change Decision Card */}
              <div className="mb-6">
                <Card className="shadow-sm border-[#ebe9f1]">
                  <div className="flex items-center justify-between px-6 py-4">
                    <span className="text-lg font-semibold text-[#22314d] font-montserrat">
                      Temperature Change Decision
                    </span>
                    <div className="flex gap-3">
                      <Button className="bg-[#22314d] hover:bg-[#028a4a] text-white font-montserrat px-6">
                        <span className="mr-2">✔</span>Approve
                      </Button>
                      <Button className="bg-[#22314d] hover:bg-red-600 text-white font-montserrat px-6">
                        <span className="mr-2">✖</span>Decline
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Two Cards Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Power Consumption Card */}
                <Card className="shadow-sm border-[#ebe9f1] min-h-[220px] flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-[#22314d] font-montserrat">
                      Power Consumption
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 items-center justify-center">
                    <span className="text-[#5e6e7b] text-base font-montserrat text-center">
                      No power data available
                    </span>
                  </CardContent>
                </Card>
                {/* Environmental Temperature Card */}
                <Card className="shadow-sm border-[#ebe9f1] min-h-[220px] flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-[#22314d] font-montserrat">
                      Environmental Temperature
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 items-center justify-center">
                    <span className="text-[#5e6e7b] text-base font-montserrat text-center">
                      No temperature data available
                    </span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default EnvironmentalTemperature;
