import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { bookingId, seats, totalAmount, movieId, cinemaId, showtime } = await req.json();

    if (!bookingId || !seats || !totalAmount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured in Edge Function secrets");
      return new Response(
        JSON.stringify({ 
          error: "STRIPE_SECRET_KEY is not configured. Please set it in Supabase Edge Function secrets.",
          details: "Go to Supabase Dashboard > Edge Functions > create-checkout-session > Settings > Secrets"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Stripe Checkout Session
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("payment_method_types[]", "card");
    params.append("line_items[0][price_data][currency]", "php");
    params.append("line_items[0][price_data][product_data][name]", `Cinema Booking - ${seats.length} Seat(s)`);
    params.append("line_items[0][price_data][product_data][description]", `Movie ID: ${movieId}, Cinema ID: ${cinemaId}, Showtime: ${showtime}`);
    params.append("line_items[0][price_data][unit_amount]", Math.round(totalAmount * 100).toString());
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `${Deno.env.get("SITE_URL") || "http://localhost:8081"}/booking-success?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${Deno.env.get("SITE_URL") || "http://localhost:8081"}/seats/${movieId}/${cinemaId}?time=${encodeURIComponent(showtime)}`);
    params.append("metadata[booking_id]", bookingId);
    if (movieId) params.append("metadata[movie_id]", movieId);
    if (cinemaId) params.append("metadata[cinema_id]", cinemaId);
    if (showtime) params.append("metadata[showtime]", showtime);

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error("Stripe error:", errorText);
      throw new Error("Failed to create checkout session");
    }

    const session = await stripeResponse.json();

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

