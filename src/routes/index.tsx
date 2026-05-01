import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, BookOpen, FlaskConical, Library } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الرئيسية — مكتبة قسم تكنولوجيا التعليم" },
      { name: "description", content: "بوابة المكتبة الرقمية لقسم تكنولوجيا التعليم: رسائل، كتب، وأبحاث علمية." },
    ],
  }),
  component: Home,
});

const cats = [
  { to: "/phd", title: "رسائل دكتوراه", desc: "أحدث الرسائل والدراسات لدرجة الدكتوراه.", icon: GraduationCap },
  { to: "/master", title: "رسائل ماجستير", desc: "رسائل ماجستير في تكنولوجيا التعليم.", icon: GraduationCap },
  { to: "/books", title: "الكتب", desc: "مراجع علمية ومؤلفات أكاديمية.", icon: BookOpen },
  { to: "/research", title: "الأبحاث العلمية", desc: "أبحاث منشورة في دوريات علمية محكّمة.", icon: FlaskConical },
] as const;

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-95" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-primary-foreground md:px-6 md:py-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Library className="h-7 w-7" aria-hidden="true" />
            </div>
            <span className="text-sm opacity-90">كلية التربية النوعية — قسم تكنولوجيا التعليم</span>
          </div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            بوابة المكتبة الرقمية للبحث العلمي والطلاب
          </h1>
          <p className="mt-4 max-w-2xl text-lg opacity-90">
            استعرض الرسائل العلمية، الكتب، والأبحاث المنشورة، واطلب استعارتها بسهولة في خطوات بسيطة.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/books" className="rounded-lg bg-white px-6 py-3 font-semibold text-primary shadow-[var(--shadow-elegant)] transition hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">تصفح الكتب</Link>
            <Link to="/research" className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20 outline-none focus-visible:ring-2 focus-visible:ring-white">الأبحاث العلمية</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">أقسام المكتبة</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              aria-label={`${c.title} — ${c.desc}`}
              className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <c.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
