import { createFileRoute } from "@tanstack/react-router";
import { FreeEduTechBooksView } from "@/components/FreeEduTechBooksView";

export const Route = createFileRoute("/free-edu-tech-books")({
  head: () => ({
    meta: [
      { title: "الكتب المجانية في تكنولوجيا التعليم — مكتبة القسم" },
      { name: "description", content: "تصفح الكتب المجانية في مجال تكنولوجيا التعليم وحمّلها مباشرة." },
      { property: "og:title", content: "الكتب المجانية في تكنولوجيا التعليم" },
      { property: "og:description", content: "مكتبة الكتب المجانية في تكنولوجيا التعليم مع روابط تحميل مباشرة." },
    ],
  }),
  component: FreeEduTechBooksView,
});