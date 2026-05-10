ALTER TABLE public.library_items ADD COLUMN IF NOT EXISTS item_code text;
ALTER TABLE public.edu_tech_research ADD COLUMN IF NOT EXISTS item_code text;
ALTER TABLE public.free_edu_tech_books ADD COLUMN IF NOT EXISTS item_code text;
CREATE INDEX IF NOT EXISTS idx_library_items_code ON public.library_items(item_code);
CREATE INDEX IF NOT EXISTS idx_edu_tech_research_code ON public.edu_tech_research(item_code);
CREATE INDEX IF NOT EXISTS idx_free_edu_tech_books_code ON public.free_edu_tech_books(item_code);