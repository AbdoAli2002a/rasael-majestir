import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/CategoryView";

export const Route = createFileRoute("/master")({
  head: () => ({
    meta: [
      { title: "رسائل ماجستير — مكتبة قسم تكنولوجيا التعليم" },
      { name: "description", content: "تصفح رسائل ماجستير واطلب الاستعارة." },
      { property: "og:title", content: "رسائل ماجستير" },
    ],
  }),
  component: () => <CategoryView type="master_thesis" />,
});
