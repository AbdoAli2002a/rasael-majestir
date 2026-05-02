import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { EduResearch } from "@/components/EduTechResearchView";

// Map common Arabic & English column headers -> DB fields
const COL_MAP: Record<string, string> = {
  "الرقم": "serial_number", "م": "serial_number", "رقم": "serial_number", "serial_number": "serial_number", "no": "serial_number",
  "العنوان": "title", "اسم البحث": "title", "title": "title",
  "المؤلف": "author", "اسم المؤلف": "author", "author": "author",
  "السنة": "year", "سنة النشر": "year", "year": "year",
  "رابط التحميل": "download_url", "الرابط": "download_url", "download_url": "download_url", "url": "download_url",
  "المصدر": "source", "source": "source",
};

type Editable = Partial<EduResearch>;

export function EduTechResearchManager({ onChange }: { onChange?: () => void }) {
  const [items, setItems] = useState<EduResearch[]>([]);
  const [editing, setEditing] = useState<Editable | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("edu_tech_research")
      .select("*")
      .order("serial_number", { ascending: true, nullsFirst: false });
    setItems((data as EduResearch[]) || []);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => { setEditing({}); setOpen(true); };
  const startEdit = (it: EduResearch) => { setEditing(it); setOpen(true); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title || !editing.author) {
      return toast.error("العنوان والمؤلف مطلوبان");
    }
    const payload = {
      serial_number: editing.serial_number ? Number(editing.serial_number) : null,
      title: editing.title,
      author: editing.author,
      year: editing.year ? Number(editing.year) : null,
      download_url: editing.download_url || null,
      source: editing.source || null,
    };
    let error;
    if (editing.id) {
      ({ error } = await supabase.from("edu_tech_research").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("edu_tech_research").insert(payload));
    }
    if (error) return toast.error(error.message);
    toast.success("تم الحفظ");
    setOpen(false); setEditing(null); load(); onChange?.();
  };

  const del = async (id: string) => {
    if (!confirm("حذف البحث نهائياً؟")) return;
    const { error } = await supabase.from("edu_tech_research").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف"); load(); onChange?.();
  };

  const handleExcel = async (file: File) => {
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: null });
      const records = rows.map((r) => {
        const out: any = {};
        for (const [k, v] of Object.entries(r)) {
          const key = COL_MAP[String(k).trim()];
          if (!key) continue;
          if (key === "year" || key === "serial_number") {
            out[key] = v ? Number(v) : null;
          } else {
            out[key] = v == null ? null : String(v);
          }
        }
        return out;
      }).filter((r) => r.title && r.author);

      if (records.length === 0) {
        toast.error("لا توجد صفوف صالحة. تأكد من وجود أعمدة العنوان والمؤلف.");
        return;
      }
      const { error } = await supabase.from("edu_tech_research").insert(records);
      if (error) throw error;
      toast.success(`تم رفع ${records.length} بحثاً.`);
      load(); onChange?.();
    } catch (e: any) {
      toast.error(e.message || "فشل رفع الملف");
    } finally { setBusy(false); }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>رفع جماعي من Excel</CardTitle>
          <CardDescription>
            الأعمدة المدعومة: الرقم، العنوان (اسم البحث)، المؤلف، السنة، رابط التحميل، المصدر.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              disabled={busy}
              onChange={(e) => e.target.files?.[0] && handleExcel(e.target.files[0])}
              aria-label="رفع ملف اكسيل"
            />
            <Upload className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
          {busy && <p className="mt-2 text-xs text-muted-foreground">جارِ المعالجة...</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle>إدارة أبحاث تكنولوجيا التعليم</CardTitle>
          <Button onClick={startNew}><Plus className="ml-1 h-4 w-4" aria-hidden="true" />إضافة بحث</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الرقم</TableHead>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">المؤلف</TableHead>
                  <TableHead className="text-right">السنة</TableHead>
                  <TableHead className="text-right">الرابط</TableHead>
                  <TableHead className="text-right">المصدر</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">لا توجد أبحاث</TableCell>
                  </TableRow>
                ) : items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell>{it.serial_number ?? "-"}</TableCell>
                    <TableCell className="max-w-xs truncate font-medium">{it.title}</TableCell>
                    <TableCell className="max-w-[10rem] truncate">{it.author}</TableCell>
                    <TableCell>{it.year ?? "-"}</TableCell>
                    <TableCell>
                      {it.download_url ? (
                        <a
                          href={it.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
                          aria-label={`فتح رابط ${it.title}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          فتح
                        </a>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="max-w-[12rem] truncate text-xs text-muted-foreground">{it.source ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(it)} aria-label="تعديل"><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => del(it.id)} aria-label="حذف"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent dir="rtl" className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editing?.id ? "تعديل بحث" : "إضافة بحث"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label>الرقم</Label>
                  <Input
                    type="number"
                    value={editing?.serial_number ?? ""}
                    onChange={(e) => setEditing({ ...editing, serial_number: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>السنة</Label>
                  <Input
                    type="number"
                    value={editing?.year ?? ""}
                    onChange={(e) => setEditing({ ...editing, year: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label>اسم البحث</Label>
                  <Input value={editing?.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label>اسم المؤلف</Label>
                  <Input value={editing?.author ?? ""} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
                </div>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label>رابط التحميل</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={editing?.download_url ?? ""}
                    onChange={(e) => setEditing({ ...editing, download_url: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label>المصدر</Label>
                  <Input value={editing?.source ?? ""} onChange={(e) => setEditing({ ...editing, source: e.target.value })} />
                </div>
              </div>
              <Button onClick={save} className="mt-2">حفظ</Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}