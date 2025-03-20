
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../utils/cors.ts";
import { generateEstimateEmailHtml } from "../utils/emailTemplates.ts";
import { logEmailToDatabase } from "../services/databaseService.ts";

// Initialize Resend with the API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

export async function handleSendEstimate(req: Request): Promise<Response> {
  try {
    console.log("Received request to send estimate email");
    const { estimateId, emailData } = await req.json();
    
    if (!emailData || !estimateId) {
      throw new Error("Missing required data: estimate data or estimate ID");
    }
    
    const { estimateData, contactInfo } = emailData;

    console.log("Estimate ID:", estimateId);
    console.log("Contact Info:", contactInfo);
    
    // Create HTML content for the email
    const emailHtml = generateEstimateEmailHtml(estimateData, contactInfo);
    
    // Send the email using Resend's default testing domain
    const emailResponse = await resend.emails.send({
      from: "Paint Pro Estimator <onboarding@resend.dev>",
      to: [contactInfo.email],
      subject: `Your Paint Pro Estimate: ${contactInfo.projectName}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);
    
    // Log the email to the database
    const logResponse = await logEmailToDatabase(
      estimateId,
      contactInfo.email,
      `Your Paint Pro Estimate: ${contactInfo.projectName}`,
      'estimate-email',
      { estimateId: estimateId }
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
}
