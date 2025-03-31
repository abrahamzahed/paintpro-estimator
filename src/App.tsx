
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Estimator from "./components/Estimator";
import { useEffect, useRef } from "react";
import { isRunningInIframe } from "./utils/iframeHandler";

const queryClient = new QueryClient();

const App = () => {
  // Create a reference to track processed elements
  const processedElements = useRef(new WeakSet());
  
  // Set a data attribute on HTML element when running in iframe
  useEffect(() => {
    if (isRunningInIframe()) {
      document.documentElement.setAttribute('data-in-iframe', 'true');
    } else {
      document.documentElement.removeAttribute('data-in-iframe');
    }
    
    // Safer watermark handling that only hides elements without removing them
    const safelyHandleWatermarks = () => {
      try {
        // More specific selectors to target only actual watermarks
        const selectors = [
          '.lovable-watermark',
          '.gpt-watermark',
          '.edit-button-overlay',
          '[data-testid="lovable-watermark"]',
          '[data-lovable="watermark"]',
          'a[href*="lovable.dev"]',
          'a[href*="gptengineer.app"]'
        ];
        
        // Use a single selector string for better performance
        const elements = document.querySelectorAll(selectors.join(','));
        
        elements.forEach(element => {
          // Skip if already processed or is a critical element
          if (processedElements.current.has(element) || element.id === 'root') {
            return;
          }
          
          // Mark as processed
          processedElements.current.add(element);
          
          // Cast to HTMLElement to access style
          const htmlElement = element as HTMLElement;
          
          // Just hide the element with CSS - no DOM removal
          htmlElement.style.display = 'none';
          htmlElement.style.visibility = 'hidden'; 
          htmlElement.style.opacity = '0';
          htmlElement.style.pointerEvents = 'none';
          htmlElement.style.height = '0';
          htmlElement.style.width = '0';
          htmlElement.style.position = 'absolute';
          htmlElement.style.overflow = 'hidden';
          htmlElement.setAttribute('aria-hidden', 'true');
          
          // No DOM removal, just CSS hiding
        });
      } catch (error) {
        // Silent fail to avoid breaking the app
      }
    };
    
    // Run with a delay to avoid React rendering conflicts
    const timeout = setTimeout(safelyHandleWatermarks, 3000);
    // Use longer interval to avoid frequent operations
    const interval = setInterval(safelyHandleWatermarks, 15000);
    
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
