/*
  # Create timer presets table

  1. New Tables
    - `timer_presets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `minutes` (integer)
      - `alerts` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `timer_presets` table
    - Add policies for authenticated users to manage their presets
*/

CREATE TABLE IF NOT EXISTS timer_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  minutes integer NOT NULL,
  alerts jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE timer_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own presets"
  ON timer_presets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presets"
  ON timer_presets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presets"
  ON timer_presets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presets"
  ON timer_presets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);