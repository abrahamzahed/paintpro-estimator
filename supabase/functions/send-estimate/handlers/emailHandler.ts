
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../utils/cors.ts";
import { generateEstimateEmailHtml } from "../utils/emailTemplates.ts";
import { logEmailToDatabase } from "../services/databaseService.ts";

// Initialize Resend with the API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
// Get the verified email (if any) from environment variables
const VERIFIED_EMAIL = Deno.env.get("VERIFIED_EMAIL") || "abraham.zahed@gmail.com";
const IS_PRODUCTION = Deno.env.get("IS_PRODUCTION") === "true";

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
    
    // Check if we need to redirect emails in development mode
    const recipientEmail = IS_PRODUCTION ? contactInfo.email : VERIFIED_EMAIL;
    const isRedirected = recipientEmail !== contactInfo.email;
    
    if (isRedirected) {
      console.log(`Development mode: Redirecting email from ${contactInfo.email} to ${recipientEmail}`);
    }
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
      
      // Return more detailed error information
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: emailResponse.error.message,
          details: "Email sending failed due to Resend API restrictions. In development, emails can only be sent to verified addresses.",
          isRedirected,
          originalRecipient: contactInfo.email,
          actualRecipient: recipientEmail,
          devMode: !IS_PRODUCTION
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
      contactInfo.email, // Log the original intended recipient
      `Your Paint Pro Estimate: ${contactInfo.projectName || 'New Project'}`,
      'estimate-email',
      { 
        estimateId: estimateId,
        isRedirected,
        actualRecipient: recipientEmail 
      }
    );

    console.log("Email logged to database with ID:", logResponse?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: isRedirected ? 
          "Estimate saved successfully. In development mode, the email was sent to the verified address instead of the recipient." : 
          "Estimate sent successfully",
        emailId: emailResponse.id,
        logId: logResponse?.id,
        isRedirected,
        originalRecipient: contactInfo.email,
        actualRecipient: recipientEmail,
        devMode: !IS_PRODUCTION
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
