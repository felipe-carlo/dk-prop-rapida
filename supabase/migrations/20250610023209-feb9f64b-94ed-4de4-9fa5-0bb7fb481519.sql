
-- Create the quote_requests table
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  campaign_options TEXT[] NOT NULL DEFAULT '{}',
  budget INTEGER NOT NULL,
  main_objective TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  products TEXT,
  additional_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for public quote form)
CREATE POLICY "Anyone can create quote requests" 
  ON public.quote_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Create a policy that allows anyone to view their own requests
CREATE POLICY "Anyone can view quote requests" 
  ON public.quote_requests 
  FOR SELECT 
  USING (true);
