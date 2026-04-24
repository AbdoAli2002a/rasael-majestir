import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, LogOut } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة الإدارة" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="py-20 text-center text-muted-foreground">جارِ التحقق...</div>;

  if (user && isAdmin) return <AdminDashboard onLogout={() => supabase.auth.signOut()} />;

  if (user && !isAdmin) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-foreground">هذا الحساب لا يملك صلاحيات الإدارة.</p>
        <Button className="mt-4" variant="outline" onClick={() => supabase.auth.signOut()}>
          <LogOut className="ml-2 h-4 w-4" /> تسجيل الخروج
        </Button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const redirectUrl = `${window.location.origin}/admin`;
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl } });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("تم إنشاء الحساب. أول حساب يُمنح صلاحية الإدارة تلقائياً.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-16">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Shield className="h-5 w-5" /></div>
            <div>
              <CardTitle>{mode === "signin" ? "دخول الإدارة" : "إنشاء حساب إدارة"}</CardTitle>
              <CardDescription>{mode === "signup" ? "أول حساب يُسجَّل سيكون مسؤول النظام." : "أدخل بيانات الدخول الخاصة بك."}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="em">البريد الإلكتروني</Label>
              <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pw">كلمة المرور</Label>
              <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
            </div>
            <Button disabled={busy} type="submit">{busy ? "..." : mode === "signin" ? "دخول" : "إنشاء حساب"}</Button>
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-xs text-muted-foreground hover:text-foreground">
              {mode === "signin" ? "إنشاء حساب جديد (للمسؤول الأول)" : "لديّ حساب — تسجيل الدخول"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
