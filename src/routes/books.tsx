import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/CategoryView";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "الكتب — مكتبة قسم تكنولوجيا التعليم" },
      { name: "description", content: "تصفح الكتب واطلب الاستعارة." },
      { property: "og:title", content: "الكتب" },
    ],
  }),
  component: () => <CategoryView type="book" />,
});
