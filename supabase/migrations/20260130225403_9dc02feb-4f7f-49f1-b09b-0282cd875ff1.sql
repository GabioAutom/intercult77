-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can insert locations" ON public.locations;
DROP POLICY IF EXISTS "Admins can update locations" ON public.locations;
DROP POLICY IF EXISTS "Admins can delete locations" ON public.locations;
DROP POLICY IF EXISTS "Anyone can view locations" ON public.locations;

-- Recreate as PERMISSIVE policies (default behavior)
CREATE POLICY "Anyone can view locations" 
ON public.locations 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert locations" 
ON public.locations 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update locations" 
ON public.locations 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete locations" 
ON public.locations 
FOR DELETE 
USING (is_admin());