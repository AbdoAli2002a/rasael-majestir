import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { ITEM_TYPES, type ItemType } from "@/lib/library";

// Map common Arabic & English column headers -> DB fields
const COL_MAP: Record<string, string> = {
  "العنوان": "title", "title": "title",
  "المؤلف": "author", "author": "author",
  "سنة النشر": "year", "السنة": "year", "year": "year",
  "المشرفون": "supervisors", "المشرف": "supervisors", "supervisors": "supervisors",
  "التصنيف الفرعي": "sub_category", "التصنيف": "sub_category", "sub_category": "sub_category",
  "مكان النشر": "publication_place", "publication_place": "publication_place",
  "الناشر": "publisher", "publisher": "publisher",
  "اسم الدورية": "journal_name", "الدورية": "journal_name", "journal_name": "journal_name",
  "المجلد": "volume", "volume": "volume",
  "العدد": "issue", "issue": "issue",
};

export function ExcelUploader({ onDone }: { onDone: () => void }) {
  const [type, setType] = useState<ItemType>("book");
  const [busy, setBusy] = useState(false);

  const handle = async (file: File) => {
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: null });
      const records = rows.map((r) => {
        const out: any = { type };
        for (const [k, v] of Object.entries(r)) {
          const key = COL_MAP[String(k).trim()];
          if (!key) continue;
          out[key] = key === "year" ? (v ? Number(v) : null) : (v == null ? null : String(v));
        }
        return out;
      }).filter((r) => r.title && r.author);

      if (records.length === 0) {
        toast.error("لا توجد صفوف صالحة. تأكد من وجود أعمدة العنوان والمؤلف.");
        setBusy(false); return;
      }

      const { error } = await supabase.from("library_items").insert(records);
      if (error) throw error;
      toast.success(`تم رفع ${records.length} عنصراً.`);
      onDone();
    } catch (e: any) {
      toast.error(e.message || "فشل رفع الملف");
    } finally { setBusy(false); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>رفع جماعي من Excel</CardTitle>
        <CardDescription>
          ارفع ملف .xlsx يحتوي على أعمدة عربية أو إنجليزية. الأعمدة المدعومة:
          العنوان، المؤلف، سنة النشر، المشرفون، التصنيف الفرعي، مكان النشر، الناشر، اسم الدورية، المجلد، العدد.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
          <Label>التصنيف</Label>
          <Select value={type} onValueChange={(v) => setType(v as ItemType)}>
            <SelectTrigger className="w-60"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.entries(ITEM_TYPES) as [ItemType, string][]).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="xl">الملف</Label>
          <div className="flex items-center gap-2">
            <Input id="xl" type="file" accept=".xlsx,.xls,.csv" disabled={busy}
              onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])} />
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          {busy && <p className="text-xs text-muted-foreground">جارِ المعالجة...</p>}
        </div>
      </CardContent>
    </Card>
  );
}
