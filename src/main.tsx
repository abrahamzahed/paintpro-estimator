
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to remove any watermark-related elements
const removeWatermarkElements = () => {
  console.error('Running comprehensive watermark removal');
  
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
  
  // Remove each potential watermark element
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      console.error(`Removing watermark element matching: ${selector}`, element);
      element.remove();
    });
  });
  
  // Also remove any scripts that might be injecting watermarks
  document.querySelectorAll('script[src*="lovable"], script[src*="gpteng"]').forEach(script => {
    console.error('Removing watermark script:', script);
    script.remove();
  });
};

// Remove any potential watermark-related code
const rootElement = document.getElementById("root");
if (rootElement) {
  // Clean up any existing watermark elements that might be in the DOM
  const watermarks = document.querySelectorAll('[class*="watermark"], [class*="gpt"], [id*="watermark"], [id*="gpt"]');
  watermarks.forEach(element => element.remove());
  
  createRoot(rootElement).render(<App />);
  
  // Run watermark removal after the app has rendered
  setTimeout(removeWatermarkElements, 500);
  setTimeout(removeWatermarkElements, 1500);
  
  // Set up a more persistent watermark removal that runs periodically
  setInterval(removeWatermarkElements, 3000);
}
