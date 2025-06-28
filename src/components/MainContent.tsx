import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Save } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function MainContent() {
  return (
    <main className="flex-1 bg-[#f8f8f8] overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-[#ebe9f1] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="text-[#6e6b7b] hover:text-[#028a4a]" />
            <h1 className="text-2xl font-bold text-[#5e5873] font-montserrat">
              Optimization Space Selection
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-[#ebe9f1] text-[#6e6b7b] hover:text-[#028a4a] hover:border-[#028a4a]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              className="bg-[#028a4a] hover:bg-[#026d3c] text-white font-montserrat"
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* System Overview Card */}
          <Card className="border-[#ebe9f1] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#5e5873] font-montserrat">
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6b7b] font-montserrat">Energy Efficiency</span>
                  <span className="text-sm font-semibold text-[#28c76f]">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6b7b] font-montserrat">System Status</span>
                  <span className="text-sm font-semibold text-[#028a4a]">Optimal</span>
                                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6b7b] font-montserrat">Last Update</span>
                  <span className="text-sm text-[#6e6b7b]">5 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Data Card */}
          <Card className="border-[#ebe9f1] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#5e5873] font-montserrat">
                Environmental Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6b7b] font-montserrat">Temperature</span>
                  <span className="text-sm font-semibold text-[#5e5873]">22.5°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6b7b] font-montserrat">Air Quality</span>
                  <span className="text-sm font-semibold text-[#28c76f]">Good</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Status Card */}
          <Card className="border-[#ebe9f1] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#5e5873] font-montserrat">
                Maintenance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6b7b] font-montserrat">Next Service</span>
                  <span className="text-sm text-[#6e6b7b]">15 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6b7b] font-montserrat">Critical Issues</span>
                  <span className="text-sm font-semibold text-[#28c76f]">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6e6b7b] font-montserrat">System Health</span>
                  <span className="text-sm font-semibold text-[#28c76f]">Excellent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Working Area */}
        <Card className="mt-6 border-[#ebe9f1] shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#5e5873] font-montserrat">
              Optimization Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] bg-[#f8f8f8] border border-[#ebe9f1] rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#5e5873] font-montserrat mb-2">
                  Select Optimization Parameters
                </h3>
                <p className="text-[#6e6b7b] font-montserrat">
                  Choose the systems and parameters you want to optimize for better energy efficiency.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
