import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { STATUS_LABEL } from "@/lib/library";

type Req = {
  id: string; full_name: string; academic_id: string; phone: string; email: string;
  expected_return_date: string; status: keyof typeof STATUS_LABEL; created_at: string;
  item_id: string; library_items?: { title: string } | null;
};

const STATUS_CLR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  returned: "bg-sky-100 text-sky-800",
};

export function BorrowManager({ onChange }: { onChange: () => void }) {
  const [reqs, setReqs] = useState<Req[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const load = async () => {
    const { data } = await supabase
      .from("borrow_requests")
      .select("*, library_items(title)")
      .order("created_at", { ascending: false });
    setReqs((data as any) || []);
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, status: Req["status"]) => {
    setBusyId(id);
    const { error } = await supabase.from("borrow_requests").update({ status }).eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("تم التحديث"); load(); onChange();
  };

  return (
    <Card>
      <CardHeader><CardTitle id="borrow-requests-title">طلبات الاستعارة</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto" role="region" aria-labelledby="borrow-requests-title" tabIndex={0}>
          <Table aria-labelledby="borrow-requests-title" aria-rowcount={reqs.length}>
            <TableCaption className="sr-only">
              جدول طلبات الاستعارة يعرض اسم الطالب، العنصر المطلوب، بيانات التواصل، تاريخ الإرجاع المتوقع، وحالة الطلب مع الإجراءات المتاحة.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className="text-right">الاسم</TableHead>
                <TableHead scope="col" className="text-right">العنصر</TableHead>
                <TableHead scope="col" className="text-right">التواصل</TableHead>
                <TableHead scope="col" className="text-right">تاريخ الإرجاع المتوقع</TableHead>
                <TableHead scope="col" className="text-right">الحالة</TableHead>
                <TableHead scope="col" className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody aria-live="polite" aria-busy={busyId !== null}>
              {reqs.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">لا توجد طلبات</TableCell></TableRow>
              ) : reqs.map((r) => (
                <TableRow key={r.id}>
                  <TableCell scope="row" role="rowheader">
                    <div className="font-medium">{r.full_name}</div>
                    <div className="text-xs text-muted-foreground">{r.academic_id}</div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{r.library_items?.title ?? "—"}</TableCell>
                  <TableCell className="text-xs">
                    <a
                      href={`mailto:${r.email}`}
                      className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`إرسال بريد إلكتروني إلى ${r.full_name}`}
                    >{r.email}</a>
                    <div>
                      <a
                        href={`tel:${r.phone}`}
                        className="text-muted-foreground rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`الاتصال بـ ${r.full_name}`}
                      >{r.phone}</a>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{r.expected_return_date}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_CLR[r.status]} aria-label={`الحالة: ${STATUS_LABEL[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex flex-wrap gap-1"
                      role="group"
                      aria-label={`إجراءات على طلب ${r.full_name}`}
                    >
                      {r.status === "pending" && <>
                        <Button
                          size="sm"
                          onClick={() => update(r.id, "approved")}
                          disabled={busyId === r.id}
                          aria-label={`قبول طلب ${r.full_name}`}
                        >قبول</Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => update(r.id, "rejected")}
                          disabled={busyId === r.id}
                          aria-label={`رفض طلب ${r.full_name}`}
                        >رفض</Button>
                      </>}
                      {r.status === "approved" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => update(r.id, "returned")}
                          disabled={busyId === r.id}
                          aria-label={`تأكيد إرجاع طلب ${r.full_name}`}
                        >تم الإرجاع</Button>
                      )}
                      {(r.status === "rejected" || r.status === "returned") && (
                        <span className="text-xs text-muted-foreground">لا توجد إجراءات</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
