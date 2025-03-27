
import { useEstimatorHook } from "./estimator/useEstimatorHook";
import { isRunningInIframe } from "@/utils/iframeHandler";

export const useEstimator = () => {
  const estimator = useEstimatorHook();
  
  // If running in iframe, we can add any iframe-specific logic here
  // For example, we might want to modify certain behaviors or add monitoring
  if (isRunningInIframe()) {
    // Currently, no specific modifications are needed
    // This hook structure allows us to add iframe-specific behaviors in the future
  }
  
  return estimator;
};
