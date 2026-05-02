import { createFileRoute } from "@tanstack/react-router";
import { EduTechResearchView } from "@/components/EduTechResearchView";

export const Route = createFileRoute("/edu-tech-research")({
  head: () => ({
    meta: [
      { title: "أبحاث تكنولوجيا التعليم — مكتبة القسم" },
      { name: "description", content: "تصفح أبحاث تكنولوجيا التعليم وحمّلها مباشرة." },
      { property: "og:title", content: "أبحاث تكنولوجيا التعليم" },
      { property: "og:description", content: "مكتبة أبحاث تكنولوجيا التعليم مع روابط تحميل مباشرة." },
    ],
  }),
  component: EduTechResearchView,
});
