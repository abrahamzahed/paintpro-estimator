
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to safely remove any watermark-related elements
const removeWatermarkElements = () => {
  try {
    console.error('Running watermark removal safely');
    
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
      // Target the common bottom-right positioned elements
      'div[style*="position: fixed"][style*="bottom: 0"][style*="right: 0"]',
      'a[style*="position: fixed"][style*="bottom: 0"][style*="right: 0"]'
    ];
    
    // Instead of removing elements, hide them with CSS first
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (element && element.id !== 'root') {
          // Cast element to HTMLElement to access style property
          const htmlElement = element as HTMLElement;
          // Apply inline styles to hide the element first
          htmlElement.style.display = 'none';
          htmlElement.style.visibility = 'hidden';
          htmlElement.style.opacity = '0';
          htmlElement.style.pointerEvents = 'none';
          htmlElement.style.height = '0';
          htmlElement.style.width = '0';
          htmlElement.style.overflow = 'hidden';
          
          // Optional: Only attempt to remove if it still has a parent
          try {
            // Check if element has a parent and that the parent still contains it
            if (element.parentNode && element.parentNode.contains(element)) {
              element.parentNode.removeChild(element);
            }
          } catch (err) {
            // If removal fails, it's already hidden anyway
            console.error('Could not remove element, but it is hidden:', err);
          }
        }
      });
    });
    
    // Handle scripts more carefully
    document.querySelectorAll('script[src*="lovable"], script[src*="gpteng"]').forEach(script => {
      try {
        // Cast script to HTMLScriptElement to access src property
        const scriptElement = script as HTMLScriptElement;
        // Only remove if it's not our required script
        if (scriptElement.src !== "https://cdn.gpteng.co/gptengineer.js" && script.parentNode) {
          // Check if the script is still in the document
          if (script.parentNode.contains(script)) {
            script.parentNode.removeChild(script);
          }
        }
      } catch (err) {
        console.error('Error removing script:', err);
      }
    });
  } catch (error) {
    console.error('Error in watermark removal:', error);
  }
};

// Render the app first
const rootElement = document.getElementById("root");
if (rootElement) {
  // Create React root before doing any DOM manipulations
  createRoot(rootElement).render(<App />);
  
  // Run watermark removal after a short delay to let React finish rendering
  setTimeout(removeWatermarkElements, 1500);
  
  // Set up a less aggressive interval for periodic checks
  setInterval(removeWatermarkElements, 5000);
}
