import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FlaskConical, User, Calendar, Download, ExternalLink, Hash } from "lucide-react";

export type EduResearch = {
  id: string;
  serial_number: number | null;
  title: string;
  author: string;
  year: number | null;
  download_url: string | null;
  source: string | null;
};

export function EduTechResearchView() {
  const [items, setItems] = useState<EduResearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("edu_tech_research")
      .select("*")
      .order("serial_number", { ascending: true, nullsFirst: false })
      .then(({ data }) => {
        setItems((data as EduResearch[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(term) ||
        i.author.toLowerCase().includes(term) ||
        (i.source ?? "").toLowerCase().includes(term),
    );
  }, [items, q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">أبحاث تكنولوجيا التعليم</h1>
        <p className="mt-2 text-muted-foreground">مجموعة من الأبحاث المتخصصة في مجال تكنولوجيا التعليم مع روابط تحميل مباشرة.</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث بالعنوان أو المؤلف أو المصدر..."
            className="pr-10"
            aria-label="بحث في أبحاث تكنولوجيا التعليم"
          />
        </div>
      </div>

      {loading ? (
        <p className="py-20 text-center text-muted-foreground">جارِ التحميل...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-16 text-center">
          <FlaskConical className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">لا توجد أبحاث مطابقة.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <Card key={it.id} className="group transition hover:shadow-[var(--shadow-elegant)]">
              <CardHeader>
                {it.serial_number != null && (
                  <div className="mb-2 inline-flex w-fit items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <Hash className="h-3 w-3" aria-hidden="true" />
                    {it.serial_number}
                  </div>
                )}
                <CardTitle className="line-clamp-3 text-lg leading-snug">{it.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  {it.author}
                </div>
                {it.year && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {it.year}
                  </div>
                )}
                {it.source && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="line-clamp-2">{it.source}</span>
                  </div>
                )}
                <div className="mt-3">
                  {it.download_url ? (
                    <Button asChild className="w-full">
                      <a
                        href={it.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`تحميل البحث: ${it.title}`}
                      >
                        <Download className="ml-1 h-4 w-4" aria-hidden="true" />
                        تحميل البحث
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      رابط التحميل غير متاح
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}