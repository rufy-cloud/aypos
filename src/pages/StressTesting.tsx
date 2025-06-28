import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

const StressTesting = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 bg-[#f8f8f8] overflow-auto p-6">
            {/* Breadcrumb */}
            <div className="max-w-5xl mx-auto mb-2 flex items-center text-sm text-[#6e6b7b] font-montserrat">
              <a href="/" className="hover:underline">Home</a>
              <span className="mx-2">/</span>
              <a href="/monitoring" className="hover:underline">Monitoring</a>
              <span className="mx-2">/</span>
              <span className="font-semibold text-[#22314d]">Stress Testing</span>
            </div>

            {/* Header Row */}
            <div className="max-w-5xl mx-auto flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Zap className="h-7 w-7 text-[#22314d]" />
                <h1 className="text-2xl font-bold text-[#22314d] font-montserrat">Stress Testing</h1>
              </div>
              <a href="#" className="text-[#22314d] hover:text-[#028a4a] font-montserrat font-semibold">Debug Storage</a>
            </div>

            {/* Main Card with Stepper */}
            <div className="max-w-5xl mx-auto">
              <Card className="rounded-xl shadow-md px-8 py-8">
                {/* Stepper */}
                <ol className="relative border-l-2 border-[#ebe9f1] ml-4">
                  {/* Step 1 */}
                  <li className="mb-10 ml-6">
                    <span className="absolute -left-5 flex items-center justify-center w-8 h-8 bg-[#22314d] rounded-full text-white font-bold">1</span>
                    <h3 className="text-lg font-semibold text-[#22314d] font-montserrat mb-1">Select VMs</h3>
                    <p className="text-[#6e6b7b] mb-4">Select the VMs you want to include in the stress test.</p>
                    <div className="bg-[#f4f4f5] border border-[#ebe9f1] rounded-lg px-4 py-6 text-center text-[#6e6b7b] mb-4">
                      No VMs found. Please select VMs in the Monitoring page first.
                    </div>
                    <div className="flex gap-3">
                      <Button disabled className="bg-[#22314d] text-white font-montserrat px-6">Continue</Button>
                      <Button variant="ghost" className="text-[#22314d] font-montserrat px-6">Back</Button>
                    </div>
                  </li>
                  {/* Step 2 */}
                  <li className="mb-10 ml-6">
                    <span className="absolute -left-5 flex items-center justify-center w-8 h-8 bg-[#ebe9f1] rounded-full text-[#22314d] font-bold">2</span>
                    <h3 className="text-lg font-semibold text-[#22314d] font-montserrat mb-1">Configure Stress Level</h3>
                  </li>
                  {/* Step 3 */}
                  <li className="ml-6">
                    <span className="absolute -left-5 flex items-center justify-center w-8 h-8 bg-[#ebe9f1] rounded-full text-[#22314d] font-bold">3</span>
                    <h3 className="text-lg font-semibold text-[#22314d] font-montserrat mb-1">Run Stress Test</h3>
                  </li>
                </ol>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StressTesting;
