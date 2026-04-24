
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP POLICY IF EXISTS "Anyone can submit borrow request" ON public.borrow_requests;
CREATE POLICY "Anyone can submit borrow request"
ON public.borrow_requests FOR INSERT
WITH CHECK (
  length(trim(full_name)) > 0
  AND length(trim(academic_id)) > 0
  AND length(trim(phone)) > 0
  AND length(trim(email)) > 0
  AND expected_return_date >= CURRENT_DATE
);
