# Supabase Edge Functions Deployment Guide

## Step 1: Deploy `create-checkout-session` Function\

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Edge Functions** in the left sidebar
4. Click **"Create a new function"** or **"New Function"**
5. Name it: `create-checkout-session`
6. Copy the code from `supabase/functions/create-checkout-session/index.ts`
7. Paste it into the editor
8. Click **"Deploy"**

## Step 2: Add Stripe Secret Key

1. In the Edge Functions page, click on `create-checkout-session`
2. Go to **Settings** tab
3. Click **"Add Secret"**
4. Name: `STRIPE_SECRET_KEY`
5. Value: Your Stripe test secret key (starts with `sk_test_...`)
   - Get it from: https://dashboard.stripe.com/test/apikeys
6. Click **"Save"**

## Step 3: Add SITE_URL (Optional but recommended)

1. In the same Settings tab
2. Add another secret:
   - Name: `SITE_URL`
   - Value: `http://localhost:8081` (for local dev) or your production URL

## Step 4: Deploy `stripe-webhook` Function (Optional - for production)

1. Create another function named: `stripe-webhook`
2. Copy code from `supabase/functions/stripe-webhook/index.ts`
3. Deploy it
4. Add secret: `STRIPE_WEBHOOK_SECRET` (from Stripe Dashboard > Webhooks)

## Step 5: Create Bookings Table

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Copy and paste the SQL from `supabase/migrations/001_create_bookings_table.sql`
4. Click **"Run"**

## Testing

After deployment, try the checkout flow again. The error messages will now be more specific if something is still missing.

