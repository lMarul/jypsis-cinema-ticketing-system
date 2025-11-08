-- Create bookings table for cinema ticket bookings
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  movie_id TEXT NOT NULL,
  cinema_id TEXT NOT NULL,
  showtime TEXT NOT NULL,
  seats TEXT[] NOT NULL,
  seat_details JSONB,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid()::text = id OR true); -- For now, allow all reads. Adjust based on your auth setup.

-- Create policy to allow inserts
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (true); -- Allow all inserts for now. Adjust based on your auth setup.

-- Create policy to allow updates (for webhook)
CREATE POLICY "Service role can update bookings"
  ON bookings
  FOR UPDATE
  USING (true); -- Allow all updates for now. In production, restrict to service role.

