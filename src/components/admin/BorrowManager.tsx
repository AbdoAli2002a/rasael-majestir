import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const load = async () => {
    const { data } = await supabase
      .from("borrow_requests")
      .select("*, library_items(title)")
      .order("created_at", { ascending: false });
    setReqs((data as any) || []);
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, status: Req["status"]) => {
    const { error } = await supabase.from("borrow_requests").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم التحديث"); load(); onChange();
  };

  return (
    <Card>
      <CardHeader><CardTitle>طلبات الاستعارة</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">العنصر</TableHead>
                <TableHead className="text-right">التواصل</TableHead>
                <TableHead className="text-right">إرجاع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reqs.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">لا توجد طلبات</TableCell></TableRow>
              ) : reqs.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.full_name}</div>
                    <div className="text-xs text-muted-foreground">{r.academic_id}</div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{r.library_items?.title ?? "—"}</TableCell>
                  <TableCell className="text-xs">
                    <div>{r.email}</div><div className="text-muted-foreground">{r.phone}</div>
                  </TableCell>
                  <TableCell className="text-xs">{r.expected_return_date}</TableCell>
                  <TableCell><Badge className={STATUS_CLR[r.status]}>{STATUS_LABEL[r.status]}</Badge></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {r.status === "pending" && <>
                        <Button size="sm" onClick={() => update(r.id, "approved")}>قبول</Button>
                        <Button size="sm" variant="outline" onClick={() => update(r.id, "rejected")}>رفض</Button>
                      </>}
                      {r.status === "approved" && <Button size="sm" variant="secondary" onClick={() => update(r.id, "returned")}>تم الإرجاع</Button>}
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
