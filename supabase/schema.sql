-- Travel Planner — Supabase schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

CREATE TABLE IF NOT EXISTS itineraries (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  destination   TEXT        NOT NULL,
  start_date    TEXT,
  end_date      TEXT,
  budget        INTEGER,
  budget_type   TEXT,
  traveler_type TEXT,
  pace          TEXT,
  interests     JSONB       DEFAULT '[]',
  itinerary_data JSONB      NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security: users can only see and modify their own itineraries
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_itineraries"
  ON itineraries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insert_own_itineraries"
  ON itineraries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_itineraries"
  ON itineraries FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS itineraries_user_id_idx ON itineraries (user_id);
