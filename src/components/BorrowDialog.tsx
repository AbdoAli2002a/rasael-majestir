import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { LibraryItem } from "@/lib/library";

const schema = z.object({
  full_name: z.string().trim().min(2, "الاسم قصير جداً").max(120),
  academic_id: z.string().trim().min(3, "الرقم الأكاديمي مطلوب").max(50),
  phone: z.string().trim().min(7, "رقم الهاتف غير صحيح").max(20),
  email: z.string().trim().email("بريد إلكتروني غير صحيح").max(255),
  expected_return_date: z.string().refine((v) => new Date(v) >= new Date(new Date().toDateString()), "تاريخ الإرجاع يجب أن يكون في المستقبل"),
});

export function BorrowDialog({ item, open, onOpenChange }: { item: LibraryItem | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", academic_id: "", phone: "", email: "", expected_return_date: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("borrow_requests").insert({ ...parsed.data, item_id: item.id });
    setLoading(false);
    if (error) {
      toast.error("تعذّر إرسال الطلب");
      return;
    }
    toast.success("تم إرسال طلب الاستعارة بنجاح");
    setForm({ full_name: "", academic_id: "", phone: "", email: "", expected_return_date: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-lg">
        <DialogHeader>
          <DialogTitle>طلب استعارة</DialogTitle>
          <DialogDescription className="line-clamp-2">{item?.title}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="fn">الاسم الكامل</Label>
            <Input id="fn" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="aid">الرقم الأكاديمي / القومي</Label>
              <Input id="aid" value={form.academic_id} onChange={(e) => setForm({ ...form, academic_id: e.target.value })} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ph">رقم الهاتف</Label>
              <Input id="ph" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="em">البريد الإلكتروني</Label>
            <Input id="em" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="rd">تاريخ الإرجاع المتوقع</Label>
            <Input id="rd" type="date" value={form.expected_return_date} onChange={(e) => setForm({ ...form, expected_return_date: e.target.value })} required />
          </div>
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "جارِ الإرسال..." : "إرسال الطلب"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
