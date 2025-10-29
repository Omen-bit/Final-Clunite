-- Create table for per-access OTPs sent to club official email
CREATE TABLE IF NOT EXISTS club_access_otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  sent_to_email TEXT NOT NULL,
  code VARCHAR(6) NOT NULL,
  user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','used','expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (club_id, code, status)
);

CREATE INDEX IF NOT EXISTS idx_club_access_otps_club_id ON club_access_otps(club_id);
CREATE INDEX IF NOT EXISTS idx_club_access_otps_status ON club_access_otps(status);
CREATE INDEX IF NOT EXISTS idx_club_access_otps_expires_at ON club_access_otps(expires_at);

-- Enable RLS and allow minimal safe access
ALTER TABLE club_access_otps ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert OTP requests for clubs where they are admins
CREATE POLICY "Admins can create OTPs for their clubs" ON club_access_otps
  FOR INSERT TO authenticated
  WITH CHECK (
    club_id IN (
      SELECT club_id FROM club_memberships WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow users to read only their own OTP records (by user_id)
CREATE POLICY "Users can read their own OTPs" ON club_access_otps
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Allow server-side service role full access (implicit bypass of RLS)
-- Note: Service role bypasses RLS regardless; no explicit policy needed.


