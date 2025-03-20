
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with the API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Request handler
const handler = async (req: Request): Promise<Response> => {
  // Handle preflight CORS requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { estimateData, contactInfo } = await req.json();
    
    if (!estimateData || !contactInfo) {
      throw new Error("Missing required data: estimate data or contact info");
    }

    // Create HTML content for the email
    const emailHtml = generateEstimateEmailHtml(estimateData, contactInfo);
    
    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Paint Pro Estimator <estimate@paintpro.example.com>",
      to: [contactInfo.email],
      subject: `Your Paint Pro Estimate: ${contactInfo.projectName}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);
    
    // Log the email to the database
    const logResponse = await logEmailToDatabase(
      estimateData.id,
      contactInfo.email,
      `Your Paint Pro Estimate: ${contactInfo.projectName}`,
      'estimate-email',
      { estimateId: estimateData.id }
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Estimate sent successfully",
        emailId: emailResponse.id,
        logId: logResponse?.id 
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending estimate email:", error);
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

// Helper function to generate email HTML
function generateEstimateEmailHtml(estimateData: any, contactInfo: any): string {
  const totalFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(estimateData.total);

  const roomsList = estimateData.rooms
    .map((room: any) => {
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${room.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${room.roomType.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${room.size.size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${room.price.toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Paint Pro Estimate</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total { font-weight: bold; font-size: 18px; margin-top: 20px; text-align: right; }
          .footer { margin-top: 40px; font-size: 14px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Paint Pro Estimate</h1>
            <p>Thank you for using our estimation service!</p>
          </div>
          
          <div>
            <h2>Project Details</h2>
            <p><strong>Project Name:</strong> ${contactInfo.projectName}</p>
            <p><strong>Client:</strong> ${contactInfo.fullName}</p>
            <p><strong>Address:</strong> ${contactInfo.address}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div>
            <h2>Estimate Summary</h2>
            <table>
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Room</th>
                  <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Type</th>
                  <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Size</th>
                  <th style="text-align: right; padding: 8px; border-bottom: 2px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${roomsList}
              </tbody>
            </table>
            <div class="total">
              <p>Subtotal: $${estimateData.subtotal.toFixed(2)}</p>
              <p>Discount: $${estimateData.volumeDiscount.toFixed(2)}</p>
              <p>Total Estimate: ${totalFormatted}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This estimate is valid for 30 days. If you have any questions, please contact us.</p>
            <p>Paint Pro Services - Making your space beautiful since 2023</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Helper function to log email to the database
async function logEmailToDatabase(
  estimateId: string,
  recipient: string,
  subject: string,
  templateName: string,
  templateData: any
) {
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Log the email to the database
    const { data, error } = await supabaseAdmin
      .from("email_logs")
      .insert({
        estimate_id: estimateId,
        recipient,
        subject,
        template_name: templateName,
        template_data: templateData,
      })
      .select()
      .single();

    if (error) {
      console.error("Error logging email to database:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in logEmailToDatabase:", error);
    return null;
  }
}

// Import createClient here to avoid TypeScript errors
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// Serve the handler function
serve(handler);
