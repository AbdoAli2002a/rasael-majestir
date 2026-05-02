
CREATE TABLE public.edu_tech_research (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number INTEGER,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INTEGER,
  download_url TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.edu_tech_research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view edu tech research"
ON public.edu_tech_research FOR SELECT
USING (true);

CREATE POLICY "Admins insert edu tech research"
ON public.edu_tech_research FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update edu tech research"
ON public.edu_tech_research FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete edu tech research"
ON public.edu_tech_research FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_edu_tech_research_updated_at
BEFORE UPDATE ON public.edu_tech_research
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_edu_tech_research_year ON public.edu_tech_research(year DESC);
