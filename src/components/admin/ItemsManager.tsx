import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { ITEM_TYPES, type ItemType, type LibraryItem } from "@/lib/library";

const FIELDS: Record<ItemType, (keyof LibraryItem)[]> = {
  phd_thesis: ["title", "author", "year", "supervisors", "sub_category"],
  master_thesis: ["title", "author", "year", "supervisors", "sub_category"],
  book: ["title", "author", "publication_place", "year", "publisher", "sub_category"],
  research: ["title", "author", "journal_name", "volume", "issue", "year", "sub_category"],
};

const LABELS: Record<string, string> = {
  title: "العنوان", author: "المؤلف", year: "سنة النشر", supervisors: "المشرفون",
  sub_category: "التصنيف الفرعي", publication_place: "مكان النشر", publisher: "الناشر",
  journal_name: "اسم الدورية", volume: "المجلد", issue: "العدد",
};

export function ItemsManager({ onChange }: { onChange: () => void }) {
  const [type, setType] = useState<ItemType>("book");
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [editing, setEditing] = useState<Partial<LibraryItem> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("library_items").select("*").eq("type", type).order("created_at", { ascending: false });
    setItems((data as LibraryItem[]) || []);
  };
  useEffect(() => { load(); }, [type]);

  const startNew = () => { setEditing({ type }); setOpen(true); };
  const startEdit = (it: LibraryItem) => { setEditing(it); setOpen(true); };

  const save = async () => {
    if (!editing) return;
    const payload: any = { type, title: editing.title, author: editing.author };
    for (const f of FIELDS[type]) {
      const v = (editing as any)[f];
      payload[f] = f === "year" ? (v ? Number(v) : null) : (v ?? null);
    }
    if (!payload.title || !payload.author) return toast.error("العنوان والمؤلف مطلوبان");
    let error;
    if ((editing as any).id) {
      ({ error } = await supabase.from("library_items").update(payload).eq("id", (editing as any).id));
    } else {
      ({ error } = await supabase.from("library_items").insert(payload));
    }
    if (error) return toast.error(error.message);
    toast.success("تم الحفظ");
    setOpen(false); setEditing(null); load(); onChange();
  };

  const del = async (id: string) => {
    if (!confirm("حذف العنصر نهائياً؟")) return;
    const { error } = await supabase.from("library_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف"); load(); onChange();
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle>إدارة المحتوى</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={type} onValueChange={(v) => setType(v as ItemType)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.entries(ITEM_TYPES) as [ItemType, string][]).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={startNew}><Plus className="ml-1 h-4 w-4" />إضافة</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">المؤلف</TableHead>
                <TableHead className="text-right">السنة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">لا توجد عناصر</TableCell></TableRow>
              ) : items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="max-w-md truncate font-medium">{it.title}</TableCell>
                  <TableCell>{it.author}</TableCell>
                  <TableCell>{it.year ?? "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(it)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => del(it.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent dir="rtl" className="max-w-xl">
            <DialogHeader><DialogTitle>{(editing as any)?.id ? "تعديل عنصر" : "إضافة عنصر"} — {ITEM_TYPES[type]}</DialogTitle></DialogHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              {FIELDS[type].map((f) => (
                <div key={f as string} className={`grid gap-1.5 ${f === "title" ? "sm:col-span-2" : ""}`}>
                  <Label>{LABELS[f as string]}</Label>
                  <Input
                    type={f === "year" ? "number" : "text"}
                    value={(editing as any)?.[f] ?? ""}
                    onChange={(e) => setEditing({ ...editing, [f]: e.target.value } as any)}
                  />
                </div>
              ))}
            </div>
            <Button onClick={save} className="mt-2">حفظ</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
