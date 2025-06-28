
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EnvironmentalTemperature from "./pages/EnvironmentalTemperature";
import PreventiveMaintenance from "./pages/PreventiveMaintenance";
import MigrationAdvice from "./pages/MigrationAdvice";
import StressTesting from "./pages/StressTesting";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/environmental-temperature" element={<EnvironmentalTemperature />} />
          <Route path="/preventive-maintenance" element={<PreventiveMaintenance />} />
          <Route path="/migration-advice" element={<MigrationAdvice />} />
          <Route path="/stress-testing" element={<StressTesting />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
