import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/CategoryView";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "الأبحاث العلمية — مكتبة قسم تكنولوجيا التعليم" },
      { name: "description", content: "تصفح الأبحاث العلمية واطلب الاستعارة." },
      { property: "og:title", content: "الأبحاث العلمية" },
    ],
  }),
  component: () => <CategoryView type="research" />,
});
