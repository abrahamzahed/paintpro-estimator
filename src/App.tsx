
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
    
    // Enhanced but safer watermark removal function
    const safelyRemoveWatermarks = () => {
      try {
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
        
        // Use safer approach: hide first, then try to remove
        selectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(element => {
            // Make sure we're not affecting our main app
            if (element.id !== 'root' && element.parentNode) {
              // Hide with CSS first
              element.style.display = 'none';
              element.style.visibility = 'hidden'; 
              element.style.opacity = '0';
              element.style.pointerEvents = 'none';
              
              // Only try to remove if it's safe
              try {
                if (element.parentNode) {
                  element.parentNode.removeChild(element);
                }
              } catch (err) {
                // Element is already hidden, so it's okay if removal fails
              }
            }
          });
        });
      } catch (error) {
        // Silently catch errors to avoid breaking the app
      }
    };
    
    // Run the removal with a delay to avoid React rendering conflicts
    const timeout = setTimeout(safelyRemoveWatermarks, 2000);
    const interval = setInterval(safelyRemoveWatermarks, 10000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
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
