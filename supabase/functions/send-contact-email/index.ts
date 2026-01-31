import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service is not configured");
    }

    const { name, email, subject, message }: ContactRequest = await req.json();

    console.log("Sending contact email from:", email);

    // Send email to admin
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Intercult77 Contact <noreply@intercult77.org>",
        to: ["fabio@fotogabio.com"],
        subject: `[Contact Intercult77] ${subject}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        `,
        reply_to: email,
      }),
    });

    if (!adminRes.ok) {
      const errorData = await adminRes.text();
      console.error("Resend API error (admin):", errorData);
      throw new Error(`Failed to send email to admin: ${errorData}`);
    }

    const adminData = await adminRes.json();
    console.log("Admin email sent successfully:", adminData);

    // Send acknowledgment email to sender
    const ackRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Intercult77 <noreply@intercult77.org>",
        to: [email],
        subject: "Confirmation de réception - Intercult77",
        html: `
          <h2>Merci pour votre message !</h2>
          <p>Bonjour ${name},</p>
          <p>Nous avons bien reçu votre message concernant : <strong>${subject}</strong></p>
          <p>Notre équipe vous répondra dans les plus brefs délais.</p>
          <hr />
          <p><em>Récapitulatif de votre message :</em></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
          <hr />
          <p>Cordialement,<br />L'équipe Intercult77</p>
        `,
      }),
    });

    if (!ackRes.ok) {
      const errorData = await ackRes.text();
      console.error("Resend API error (acknowledgment):", errorData);
      // Don't throw - admin email was sent successfully
    } else {
      const ackData = await ackRes.json();
      console.log("Acknowledgment email sent successfully:", ackData);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
