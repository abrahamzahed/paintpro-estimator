
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../utils/cors.ts";

// Helper function to log email to the database
export async function logEmailToDatabase(
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
