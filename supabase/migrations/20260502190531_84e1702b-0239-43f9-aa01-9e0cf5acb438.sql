CREATE TABLE public.free_edu_tech_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INTEGER,
  download_url TEXT,
  description TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.free_edu_tech_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view free edu tech books"
ON public.free_edu_tech_books FOR SELECT
USING (true);

CREATE POLICY "Admins insert free edu tech books"
ON public.free_edu_tech_books FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update free edu tech books"
ON public.free_edu_tech_books FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete free edu tech books"
ON public.free_edu_tech_books FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_free_edu_tech_books_updated_at
BEFORE UPDATE ON public.free_edu_tech_books
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();