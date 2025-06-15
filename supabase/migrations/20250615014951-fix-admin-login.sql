
-- Fix the verify_admin_login function to properly handle password verification
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
  -- Log the function call for debugging
  RAISE LOG 'verify_admin_login called with username: %', admin_username;
  
  -- Get the admin user record
  SELECT au.id, au.username, au.password_hash, au.created_at, au.updated_at
  INTO admin_record
  FROM admin_users au
  WHERE au.username = admin_username;
  
  -- Log if user was found
  IF admin_record.id IS NOT NULL THEN
    RAISE LOG 'User found: %', admin_record.username;
    RAISE LOG 'Stored hash: %', admin_record.password_hash;
  ELSE
    RAISE LOG 'User not found';
    RETURN;
  END IF;
  
  -- Check if user exists and password matches
  -- The crypt function should compare the plain password with the stored hash
  IF admin_record.id IS NOT NULL AND crypt(admin_password, admin_record.password_hash) = admin_record.password_hash THEN
    RAISE LOG 'Password verification successful';
    -- Return user data without password
    RETURN QUERY SELECT 
      admin_record.id,
      admin_record.username,
      admin_record.created_at,
      admin_record.updated_at;
  ELSE
    RAISE LOG 'Password verification failed';
  END IF;
  
  -- Return nothing if credentials are invalid
  RETURN;
END;
$$;
