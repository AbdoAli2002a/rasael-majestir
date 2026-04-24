import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, User, Calendar } from "lucide-react";
import { ITEM_TYPES, type ItemType, type LibraryItem } from "@/lib/library";
import { BorrowDialog } from "./BorrowDialog";

export function CategoryView({ type }: { type: ItemType }) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sub, setSub] = useState<string>("all");
  const [picked, setPicked] = useState<LibraryItem | null>(null);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("library_items")
      .select("*")
      .eq("type", type)
      .order("year", { ascending: false, nullsFirst: false })
      .then(({ data }) => {
        setItems((data as LibraryItem[]) || []);
        setLoading(false);
      });
  }, [type]);

  const subs = useMemo(() => Array.from(new Set(items.map((i) => i.sub_category).filter(Boolean))) as string[], [items]);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((i) => {
      if (sub !== "all" && i.sub_category !== sub) return false;
      if (!term) return true;
      return i.title.toLowerCase().includes(term) || i.author.toLowerCase().includes(term);
    });
  }, [items, q, sub]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{ITEM_TYPES[type]}</h1>
        <p className="mt-2 text-muted-foreground">تصفح، ابحث، واستعِر مما تحتاج.</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالعنوان أو المؤلف..." className="pr-10" />
        </div>
        {subs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant={sub === "all" ? "default" : "outline"} onClick={() => setSub("all")}>الكل</Button>
            {subs.map((s) => (
              <Button key={s} size="sm" variant={sub === s ? "default" : "outline"} onClick={() => setSub(s)}>{s}</Button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-20">جارِ التحميل...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-16 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">لا توجد نتائج مطابقة.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <Card key={it.id} className="group transition hover:shadow-[var(--shadow-elegant)]">
              <CardHeader>
                {it.sub_category && <Badge variant="secondary" className="mb-2 w-fit">{it.sub_category}</Badge>}
                <CardTitle className="line-clamp-2 text-lg leading-snug">{it.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><User className="h-3.5 w-3.5" />{it.author}</div>
                {it.year && <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-3.5 w-3.5" />{it.year}</div>}
                {it.supervisors && <p className="text-xs text-muted-foreground">المشرفون: {it.supervisors}</p>}
                {it.publisher && <p className="text-xs text-muted-foreground">{it.publication_place ? `${it.publication_place} — ` : ""}{it.publisher}</p>}
                {it.journal_name && <p className="text-xs text-muted-foreground">{it.journal_name}{it.volume ? ` — مج ${it.volume}` : ""}{it.issue ? ` ع ${it.issue}` : ""}</p>}
                <Button onClick={() => setPicked(it)} className="mt-3 w-full" variant="default">استعارة</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <BorrowDialog item={picked} open={!!picked} onOpenChange={(v) => !v && setPicked(null)} />
    </div>
  );
}
