import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/CategoryView";

export const Route = createFileRoute("/phd")({
  head: () => ({
    meta: [
      { title: "رسائل دكتوراه — مكتبة قسم تكنولوجيا التعليم" },
      { name: "description", content: "تصفح رسائل دكتوراه واطلب الاستعارة." },
      { property: "og:title", content: "رسائل دكتوراه" },
    ],
  }),
  component: () => <CategoryView type="phd_thesis" />,
});
