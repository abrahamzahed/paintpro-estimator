
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
    console.log("Contact Info:", JSON.stringify(contactInfo, null, 2));
    console.log("Number of rooms in estimate:", estimateData.rooms.length);
    
    // Create HTML content for the email
    const emailHtml = generateEstimateEmailHtml(estimateData, contactInfo);
    console.log("Generated email HTML for estimate");
    
    // Validate that we have a valid recipient email
    if (!contactInfo.email || !contactInfo.email.includes('@')) {
      throw new Error("Invalid recipient email address: " + contactInfo.email);
    }
    
    // Use the recipient's email directly without redirection
    const recipientEmail = contactInfo.email;
    console.log("Sending email to:", recipientEmail);
    
    // Send the email with the correct domain (.io instead of .com)
    const emailResponse = await resend.emails.send({
      from: "Paint Pro Estimator <estimate@paint-pro.io>",
      to: [recipientEmail],
      subject: `Your Paint Pro Estimate: ${contactInfo.projectName || 'New Project'}`,
      html: emailHtml,
    });

    console.log("Email API response:", JSON.stringify(emailResponse));
    
    if (emailResponse.error) {
      console.error("Email sending failed with error:", emailResponse.error);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: emailResponse.error.message,
          details: "Email sending failed. " + emailResponse.error.message
        }),
        {
          status: 200, // Return 200 even for email errors to allow the UI to handle it gracefully
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          },
        }
      );
    }
    
    // Log the email to the database
    const logResponse = await logEmailToDatabase(
      estimateId,
      recipientEmail,
      `Your Paint Pro Estimate: ${contactInfo.projectName || 'New Project'}`,
      'estimate-email',
      { 
        estimateId: estimateId
      }
    );

    console.log("Email logged to database with ID:", logResponse?.id);

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
