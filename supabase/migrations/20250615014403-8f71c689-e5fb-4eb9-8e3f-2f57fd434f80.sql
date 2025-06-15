
-- Create a function to verify admin login credentials
CREATE OR REPLACE FUNCTION public.verify_admin_login(
  admin_username TEXT,
  admin_password TEXT
)
RETURNS TABLE (
  id UUID,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Get the admin user record
  SELECT au.id, au.username, au.password_hash, au.created_at, au.updated_at
  INTO admin_record
  FROM admin_users au
  WHERE au.username = admin_username;
  
  -- Check if user exists and password matches
  IF admin_record.id IS NOT NULL AND crypt(admin_password, admin_record.password_hash) = admin_record.password_hash THEN
    -- Return user data without password
    RETURN QUERY SELECT 
      admin_record.id,
      admin_record.username,
      admin_record.created_at,
      admin_record.updated_at;
  END IF;
  
  -- Return nothing if credentials are invalid
  RETURN;
END;
$$;
