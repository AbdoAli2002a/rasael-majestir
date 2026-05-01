import { useMemo, useState } from "react";
import { Quote, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CITATION_STYLES, generateCitation, type CitationStyle } from "@/lib/citations";
import type { LibraryItem } from "@/lib/library";

export function CitationDialog({ item }: { item: LibraryItem }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<CitationStyle | null>(null);

  const citations = useMemo(
    () => Object.fromEntries(CITATION_STYLES.map((s) => [s, generateCitation(item, s)])) as Record<CitationStyle, string>,
    [item],
  );

  const handleCopy = async (style: CitationStyle) => {
    try {
      await navigator.clipboard.writeText(citations[style]);
      setCopied(style);
      toast.success(`تم نسخ التوثيق بصيغة ${style}`);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error("تعذّر النسخ");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          aria-label={`توليد توثيق مرجعي لـ ${item.title}`}
        >
          <Quote className="ms-1 h-3.5 w-3.5" aria-hidden="true" />
          توثيق مرجعي
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>الاستشهاد المرجعي</DialogTitle>
          <DialogDescription className="line-clamp-2">{item.title}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="APA" dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            {CITATION_STYLES.map((s) => (
              <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
            ))}
          </TabsList>
          {CITATION_STYLES.map((s) => (
            <TabsContent key={s} value={s} className="mt-3 space-y-3">
              <div
                className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-7 text-foreground"
                dir="auto"
                lang={s === "APA" || s === "MLA" ? "en" : undefined}
                tabIndex={0}
                role="textbox"
                aria-readonly="true"
                aria-label={`نص التوثيق بصيغة ${s}`}
              >
                {citations[s]}
              </div>
              <Button
                onClick={() => handleCopy(s)}
                className="w-full"
                aria-label={`نسخ التوثيق بصيغة ${s}`}
              >
                {copied === s ? (
                  <><Check className="ms-1 h-4 w-4" aria-hidden="true" /> تم النسخ</>
                ) : (
                  <><Copy className="ms-1 h-4 w-4" aria-hidden="true" /> نسخ</>
                )}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}