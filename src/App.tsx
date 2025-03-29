
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
    
    // Enhanced watermark removal function
    const removeWatermarks = () => {
      // List of possible watermark selectors
      const selectors = [
        '.lovable-watermark',
        '.gpt-watermark',
        '.edit-button-overlay',
        '[data-testid="lovable-watermark"]',
        '[data-lovable="watermark"]',
        'a[href*="lovable.dev"]',
        'a[href*="gptengineer.app"]',
        'div[class*="watermark"]',
        'div[id*="watermark"]',
        '[class*="watermark"]',
        '[class*="gpt"]',
        '[id*="watermark"]',
        '[id*="gpt"]',
        'div[style*="position: fixed"][style*="bottom: 0"][style*="right: 0"]',
        'a[style*="position: fixed"][style*="bottom: 0"][style*="right: 0"]'
      ];
      
      // Remove each potential watermark element
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
          if (element.id !== 'root') {
            element.remove();
          }
        });
      });
      
      // Also remove any scripts that might be injecting watermarks
      document.querySelectorAll('script[src*="lovable"], script[src*="gpteng"]').forEach(script => {
        script.remove();
      });
    };
    
    // Run the removal immediately and set up recurring checks
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
