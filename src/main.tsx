
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove any potential watermark-related code
const rootElement = document.getElementById("root");
if (rootElement) {
  // Clean up any existing watermark elements that might be in the DOM
  const watermarks = document.querySelectorAll('[class*="watermark"], [class*="gpt"], [id*="watermark"], [id*="gpt"]');
  watermarks.forEach(element => element.remove());
  
  createRoot(rootElement).render(<App />);
}
