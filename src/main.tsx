
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
        if (element && element.parentNode) {
          // Apply inline styles to hide the element first
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.opacity = '0';
          element.style.pointerEvents = 'none';
          element.style.height = '0';
          element.style.width = '0';
          element.style.overflow = 'hidden';
          
          // Optional: Only attempt to remove if it still has a parent
          try {
            if (element.parentNode) {
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
        // Only remove if it's not our required script
        if (script.src !== "https://cdn.gpteng.co/gptengineer.js" && script.parentNode) {
          script.parentNode.removeChild(script);
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
