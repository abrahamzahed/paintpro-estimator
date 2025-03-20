
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { handleSendEstimate } from "./handlers/emailHandler.ts";

// Request handler
const handler = async (req: Request): Promise<Response> => {
  // Handle preflight CORS requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    return await handleSendEstimate(req);
  } catch (error: any) {
    console.error("Error in send-estimate function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  }
};

// Serve the handler function
serve(handler);
