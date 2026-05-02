import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, GraduationCap, FlaskConical, Inbox, Microscope } from "lucide-react";
import { ITEM_TYPES, type ItemType } from "@/lib/library";
import { ItemsManager } from "./ItemsManager";
import { BorrowManager } from "./BorrowManager";
import { ExcelUploader } from "./ExcelUploader";
import { EduTechResearchManager } from "./EduTechResearchManager";

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState({ phd_thesis: 0, master_thesis: 0, book: 0, research: 0, pending: 0, edu_tech: 0 });

  const loadStats = async () => {
    const counts: Record<string, number> = {};
    for (const t of Object.keys(ITEM_TYPES) as ItemType[]) {
      const { count } = await supabase.from("library_items").select("*", { count: "exact", head: true }).eq("type", t);
      counts[t] = count || 0;
    }
    const { count: pending } = await supabase.from("borrow_requests").select("*", { count: "exact", head: true }).eq("status", "pending");
    const { count: eduTech } = await supabase.from("edu_tech_research").select("*", { count: "exact", head: true });
    setStats({ ...(counts as any), pending: pending || 0, edu_tech: eduTech || 0 });
  };

  useEffect(() => { loadStats(); }, []);

  const cards = [
    { label: "رسائل دكتوراه", value: stats.phd_thesis, icon: GraduationCap },
    { label: "رسائل ماجستير", value: stats.master_thesis, icon: GraduationCap },
    { label: "كتب", value: stats.book, icon: BookOpen },
    { label: "أبحاث علمية", value: stats.research, icon: FlaskConical },
    { label: "أبحاث تكنولوجيا التعليم", value: stats.edu_tech, icon: Microscope },
    { label: "طلبات استعارة قيد المراجعة", value: stats.pending, icon: Inbox },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">لوحة الإدارة</h1>
          <p className="text-sm text-muted-foreground">إدارة المحتوى وطلبات الاستعارة.</p>
        </div>
        <Button variant="outline" onClick={onLogout}><LogOut className="ml-2 h-4 w-4" />خروج</Button>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold text-foreground">{c.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">المحتوى</TabsTrigger>
          <TabsTrigger value="excel">رفع Excel</TabsTrigger>
          <TabsTrigger value="edu_tech">أبحاث تكنولوجيا التعليم</TabsTrigger>
          <TabsTrigger value="borrow">طلبات الاستعارة</TabsTrigger>
        </TabsList>
        <TabsContent value="items"><ItemsManager onChange={loadStats} /></TabsContent>
        <TabsContent value="excel"><ExcelUploader onDone={loadStats} /></TabsContent>
        <TabsContent value="edu_tech"><EduTechResearchManager onChange={loadStats} /></TabsContent>
        <TabsContent value="borrow"><BorrowManager onChange={loadStats} /></TabsContent>
      </Tabs>
    </div>
  );
}
