import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Power, Server, Monitor, ChevronDown } from "lucide-react";

const MigrationAdvice = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 bg-[#f8f8f8] overflow-auto p-6">
            {/* Top Summary Card */}
            <div className="max-w-6xl mx-auto">
              <Card className="mb-6 rounded-xl shadow-md px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Server className="h-7 w-7 text-[#22314d]" />
                  <div>
                    <div className="text-xs text-[#6e6b7b] font-montserrat">Compute Nodes</div>
                    <div className="text-xl font-bold text-[#22314d]">0/0</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Monitor className="h-7 w-7 text-[#22314d]" />
                  <div>
                    <div className="text-xs text-[#6e6b7b] font-montserrat">Virtual Machines</div>
                    <div className="text-xl font-bold text-[#22314d]">
                      <span className="text-[#028a4a]">0 active</span> / 0 total
                    </div>
                  </div>
                </div>
              </Card>

              {/* Main Content Area */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Resource Distribution by Node */}
                <Card className="rounded-xl shadow-md px-6 py-4 col-span-1 md:col-span-2 relative min-h-[260px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-[#22314d] font-montserrat">
                      Resource Distribution by Node
                    </span>
                    <Button variant="ghost" size="icon" className="text-[#22314d] hover:text-[#028a4a]" aria-label="Refresh">
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </div>
                  {/* Chart Placeholder */}
                  <div className="w-full h-40 flex items-center justify-center">
                    <span className="text-[#5e6e7b] text-base font-montserrat text-center">
                      [Chart will appear here]
                    </span>
                  </div>
                </Card>
                {/* Migration Advice */}
                <Card className="rounded-xl shadow-md px-6 py-4 flex flex-col justify-between min-h-[260px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-[#22314d] font-montserrat flex items-center">
                      Migration Advice
                      <span className="ml-2 bg-[#28c76f]/20 text-[#28c76f] text-xs font-semibold px-3 py-1 rounded-full">Auto Mode</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-5 w-5 text-[#22314d] cursor-pointer" />
                      <Button variant="ghost" size="icon" className="text-[#22314d] hover:text-[#028a4a]" aria-label="Refresh">
                        <RefreshCw className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[#5e6e7b] text-base font-montserrat text-center">
                      No migration advice available at this time
                    </span>
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <Button className="bg-[#22314d] hover:bg-[#1a2533] text-white font-montserrat px-8 py-3 text-lg rounded-lg">
                  Decline Migration
                </Button>
                <Button className="bg-[#28c76f] hover:bg-[#028a4a] text-white font-montserrat px-8 py-3 text-lg rounded-lg flex items-center gap-2">
                  <Power className="h-5 w-5" /> Approve Migration
                </Button>
              </div>

              {/* PMs & VMs Monitoring Card */}
              <Card className="rounded-xl shadow-md px-6 py-6 mb-8">
                <h2 className="text-xl font-bold text-[#22314d] font-montserrat mb-2">PMs & VMs Monitoring</h2>
                <div className="w-full h-32 flex items-center justify-center">
                  <span className="text-[#5e6e7b] text-base font-montserrat text-center">
                    [Monitoring chart or data will appear here]
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

export default MigrationAdvice;
