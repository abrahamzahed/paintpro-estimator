
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Estimator from "./components/Estimator";
import { useEffect } from "react";
import { isRunningInIframe } from "./utils/iframeHandler";

const queryClient = new QueryClient();

const App = () => {
  // Set a data attribute on HTML element when running in iframe
  useEffect(() => {
    if (isRunningInIframe()) {
      document.documentElement.setAttribute('data-in-iframe', 'true');
    } else {
      document.documentElement.removeAttribute('data-in-iframe');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Estimator />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
