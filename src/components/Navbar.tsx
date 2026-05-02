import { Link } from "@tanstack/react-router";
import { BookOpen, GraduationCap, FlaskConical, Shield, Home, Microscope } from "lucide-react";
import facultyLogo from "@/assets/faculty-logo.jpeg";

const links = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/phd", label: "رسائل دكتوراه", icon: GraduationCap },
  { to: "/master", label: "رسائل ماجستير", icon: GraduationCap },
  { to: "/books", label: "الكتب", icon: BookOpen },
  { to: "/research", label: "الأبحاث العلمية", icon: FlaskConical },
  { to: "/edu-tech-research", label: "أبحاث تكنولوجيا التعليم", icon: Microscope },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md shadow-[var(--shadow-card)]" role="banner">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        تخطّي إلى المحتوى الرئيسي
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="مكتبة قسم تكنولوجيا التعليم — العودة إلى الصفحة الرئيسية"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/25 bg-card shadow-[var(--shadow-elegant)]">
            <img
              src={facultyLogo}
              alt="شعار كلية التربية النوعية — جامعة المنيا"
              className="h-full w-full object-cover"
              width={48}
              height={48}
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight text-foreground">مكتبة قسم تكنولوجيا التعليم</div>
            <div className="text-[11px] text-muted-foreground">كلية التربية النوعية</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-medium bg-primary/10 text-primary" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="دخول لوحة الإدارة"
        >
          <Shield className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">دخول الإدارة</span>
        </Link>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-4 pb-2 lg:hidden" aria-label="التنقل للجوال">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
            activeProps={{ className: "whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium bg-primary/10 text-primary" }}
            activeOptions={{ exact: true }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
