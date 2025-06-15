
-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy that allows admins to view other admins (for login purposes)
CREATE POLICY "Admin users can view admin users" 
  ON public.admin_users 
  FOR SELECT 
  USING (true);

-- Seed admin user (password "daki1234" => bcrypt hash)
INSERT INTO public.admin_users (username, password_hash)
VALUES ('admin', '$2b$10$BQbMOTzwnIxRb0cOFu6O/OEQdQyZc5SgNbDGYR3uTzd13toK2l1Ga')
ON CONFLICT (username) DO NOTHING;

-- Add status column to existing quote_requests table
ALTER TABLE public.quote_requests
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pendente';
