
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
    
    // Remove any watermark elements
    const removeWatermarks = () => {
      const elements = document.querySelectorAll('[class*="watermark"], [class*="gpt"], [id*="watermark"], [id*="gpt"], div[style*="position: fixed"][style*="bottom: 0"][style*="right: 0"]');
      elements.forEach((el) => {
        if (el.id !== 'root') {
          el.remove();
        }
      });
    };
    
    removeWatermarks();
    const interval = setInterval(removeWatermarks, 1000);
    
    return () => clearInterval(interval);
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
