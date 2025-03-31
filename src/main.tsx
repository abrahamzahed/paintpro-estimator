
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Safer approach that doesn't manipulate the DOM directly
const safelyHideWatermarks = () => {
  try {
    // More specific selectors to reduce risk of affecting legitimate elements
    const selectors = [
      '.lovable-watermark',
      '.gpt-watermark',
      '.edit-button-overlay',
      '[data-testid="lovable-watermark"]',
      '[data-lovable="watermark"]',
      'a[href*="lovable.dev"]',
      'a[href*="gptengineer.app"]'
    ];
    
    // Track which elements we've already processed
    const processedElements = new WeakSet();
    
    // Use a single query for better performance
    document.querySelectorAll(selectors.join(',')).forEach(element => {
      // Skip if already processed or is a critical element
      if (processedElements.has(element) || element.id === 'root') {
        return;
      }
      
      // Mark as processed
      processedElements.add(element);
      
      // Cast element to HTMLElement to access style property
      const htmlElement = element as HTMLElement;
      
      // Apply CSS hiding only, no DOM removal
      htmlElement.style.display = 'none';
      htmlElement.style.visibility = 'hidden';
      htmlElement.style.opacity = '0';
      htmlElement.style.pointerEvents = 'none';
      htmlElement.style.height = '0';
      htmlElement.style.width = '0';
      htmlElement.style.position = 'absolute';
      htmlElement.style.overflow = 'hidden';
      htmlElement.setAttribute('aria-hidden', 'true');
      
      // No DOM manipulation via removeChild
    });
    
    // Handle scripts more carefully - just disable them without removing
    document.querySelectorAll('script[src*="lovable"], script[src*="gpteng"]').forEach(script => {
      try {
        // Cast script to HTMLScriptElement to access src property
        const scriptElement = script as HTMLScriptElement;
        
        // Only process if it's not our required script
        if (scriptElement.src !== "https://cdn.gpteng.co/gptengineer.js") {
          // Mark the script as processed
          if (!processedElements.has(script)) {
            processedElements.add(script);
            
            // Disable the script by nullifying its src and removing content
            // This is safer than DOM removal
            scriptElement.setAttribute('disabled', 'true');
            scriptElement.setAttribute('type', 'text/plain');
          }
        }
      } catch (err) {
        // Silent fail
      }
    });
  } catch (error) {
    // Silent fail
  }
};

// Render the app first
const rootElement = document.getElementById("root");
if (rootElement) {
  // Create React root before doing any DOM manipulations
  createRoot(rootElement).render(<App />);
  
  // Run watermark handling after a delay to let React finish rendering
  setTimeout(safelyHideWatermarks, 3000);
  
  // Set up a less aggressive interval for periodic checks
  setInterval(safelyHideWatermarks, 15000);
}
