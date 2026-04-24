import { Link } from "@tanstack/react-router";
import { BookOpen, GraduationCap, FlaskConical, Library, Shield, Home } from "lucide-react";

const links = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/phd", label: "رسائل دكتوراه", icon: GraduationCap },
  { to: "/master", label: "رسائل ماجستير", icon: GraduationCap },
  { to: "/books", label: "الكتب", icon: BookOpen },
  { to: "/research", label: "الأبحاث العلمية", icon: FlaskConical },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md shadow-[var(--shadow-card)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)]">
            <Library className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight text-foreground">مكتبة قسم تكنولوجيا التعليم</div>
            <div className="text-[11px] text-muted-foreground">كلية التربية</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-medium bg-primary/10 text-primary" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">دخول الإدارة</span>
        </Link>
      </div>
      <div className="flex gap-1 overflow-x-auto px-4 pb-2 lg:hidden">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            activeProps={{ className: "whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium bg-primary/10 text-primary" }}
            activeOptions={{ exact: true }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
