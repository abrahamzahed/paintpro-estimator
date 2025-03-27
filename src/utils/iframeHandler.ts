
/**
 * Utility functions for iframe communication and integration
 */

/**
 * Notify the parent frame about height changes
 * @param height - Current height of the document
 */
export const notifyParentAboutHeight = (height: number): void => {
  if (window.parent !== window) {
    window.parent.postMessage({ 
      type: 'paintpro-estimator-height', 
      height 
    }, '*');
  }
};

/**
 * Notify the parent frame about the current step in the estimator
 * @param step - Current step number (1, 2, or 3)
 */
export const notifyParentAboutStep = (step: number): void => {
  if (window.parent !== window) {
    window.parent.postMessage({ 
      type: 'paintpro-estimator-step', 
      step 
    }, '*');
  }
};

/**
 * Notify the parent frame when an estimate is saved
 * @param estimateId - ID of the saved estimate
 * @param summary - Summary data of the estimate
 */
export const notifyParentAboutSave = (estimateId: string, summary: any): void => {
  if (window.parent !== window) {
    window.parent.postMessage({ 
      type: 'paintpro-estimator-saved', 
      estimateId,
      summary
    }, '*');
  }
};

/**
 * Set up a listener for incoming messages from the parent frame
 * @param callback - Function to handle messages
 */
export const listenToParentMessages = (callback: (message: any) => void): () => void => {
  const handleMessage = (event: MessageEvent) => {
    // Only process messages intended for this application
    if (event.data && event.data.type && event.data.type.startsWith('paintpro-')) {
      callback(event.data);
    }
  };

  window.addEventListener('message', handleMessage);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('message', handleMessage);
  };
};

/**
 * Detect if the application is running inside an iframe
 * @returns boolean
 */
export const isRunningInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    // If we can't access parent due to security restrictions,
    // we're likely in a cross-origin iframe
    return true;
  }
};
