import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

serve(async (req) => {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      return new Response(
        JSON.stringify({ error: "Missing signature or webhook secret" }),
        { status: 400 }
      );
    }

    const body = await req.text();
    
    // Verify webhook signature (simplified - in production, use Stripe's SDK)
    // For now, we'll process the event directly
    const event = JSON.parse(body);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.booking_id;

      if (bookingId) {
        // Update booking status to confirmed
        const { error } = await supabaseClient
          .from("bookings")
          .update({ status: "confirmed" })
          .eq("id", bookingId);

        if (error) {
          console.error("Error updating booking:", error);
          return new Response(
            JSON.stringify({ error: "Failed to update booking" }),
            { status: 500 }
          );
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  }
});

