-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create OTP table (idempotent)
CREATE TABLE IF NOT EXISTS public.club_access_otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  sent_to_email TEXT NOT NULL,
  code VARCHAR(6) NOT NULL,
  user_id UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','used','expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (club_id, code, status)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_club_access_otps_club_id ON public.club_access_otps(club_id);
CREATE INDEX IF NOT EXISTS idx_club_access_otps_status ON public.club_access_otps(status);
CREATE INDEX IF NOT EXISTS idx_club_access_otps_expires_at ON public.club_access_otps(expires_at);

-- RLS
ALTER TABLE public.club_access_otps ENABLE ROW LEVEL SECURITY;

-- Users can insert OTPs for clubs where they are admins (when not using service role)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'club_access_otps'
      AND policyname = 'Admins can create OTPs for their clubs'
  ) THEN
    CREATE POLICY "Admins can create OTPs for their clubs" ON public.club_access_otps
      FOR INSERT TO authenticated
      WITH CHECK (
        club_id IN (
          SELECT club_id FROM public.club_memberships
          WHERE user_id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Users can read only their own OTPs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'club_access_otps'
      AND policyname = 'Users can read their own OTPs'
  ) THEN
    CREATE POLICY "Users can read their own OTPs" ON public.club_access_otps
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Optionally reload PostgREST schema cache (run manually if needed):
-- SELECT pg_notify('pgrst', 'reload schema');


