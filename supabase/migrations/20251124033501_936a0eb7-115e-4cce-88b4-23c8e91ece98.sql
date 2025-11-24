-- Add name column to visitor_analytics table
ALTER TABLE public.visitor_analytics 
ADD COLUMN visitor_name text;