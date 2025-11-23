-- Create visitor analytics table
CREATE TABLE IF NOT EXISTS public.visitor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT,
  session_id TEXT
);

-- Enable RLS
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert visits
CREATE POLICY "Anyone can record visits"
  ON public.visitor_analytics
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view visit count (public analytics)
CREATE POLICY "Anyone can view visits"
  ON public.visitor_analytics
  FOR SELECT
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_visited_at 
  ON public.visitor_analytics(visited_at DESC);