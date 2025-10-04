-- Promote the first user to admin role
UPDATE public.user_roles 
SET role = 'admin'::app_role 
WHERE user_id = '432358d5-70f9-4855-8d4b-876607cbe3ae';

-- Create a function to check if any admin exists
CREATE OR REPLACE FUNCTION public.has_any_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE role = 'admin'::app_role
  )
$$;

-- Create a function to promote first user to admin if no admin exists
CREATE OR REPLACE FUNCTION public.ensure_first_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only promote if no admin exists
  IF NOT public.has_any_admin() THEN
    UPDATE public.user_roles 
    SET role = 'admin'::app_role 
    WHERE user_id = (
      SELECT user_id 
      FROM public.user_roles 
      ORDER BY created_at ASC 
      LIMIT 1
    );
  END IF;
END;
$$;