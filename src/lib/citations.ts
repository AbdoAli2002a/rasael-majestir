import type { LibraryItem } from "./library";

// Format author "Last, First" → "First Last" (best-effort for Arabic/Latin names)
function authorInverted(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name.trim();
  const last = parts[parts.length - 1];
  const rest = parts.slice(0, -1).join(" ");
  return `${last}, ${rest}`;
}

function authorNormal(name: string): string {
  return name.trim();
}

const dash = (s?: string | null) => (s && s.trim() ? s.trim() : "");

export type CitationStyle = "APA" | "MLA" | "Chicago";

export function generateCitation(item: LibraryItem, style: CitationStyle): string {
  const year = item.year ? String(item.year) : "د.ت";
  const title = dash(item.title);
  const author = dash(item.author) || "مجهول";
  const place = dash(item.publication_place);
  const publisher = dash(item.publisher);
  const journal = dash(item.journal_name);
  const vol = dash(item.volume);
  const iss = dash(item.issue);

  const isThesis = item.type === "phd_thesis" || item.type === "master_thesis";
  const thesisLabel = item.type === "phd_thesis" ? "رسالة دكتوراه" : "رسالة ماجستير";
  const thesisLabelEn = item.type === "phd_thesis" ? "Doctoral dissertation" : "Master's thesis";

  if (style === "APA") {
    // APA 7th: Author. (Year). Title. Source.
    const a = authorInverted(author);
    if (item.type === "research") {
      const volIss = vol ? `${vol}${iss ? `(${iss})` : ""}` : "";
      return `${a} (${year}). ${title}. ${journal}${volIss ? `, ${volIss}` : ""}.`.replace(/\s+/g, " ").trim();
    }
    if (isThesis) {
      return `${a} (${year}). ${title} [${thesisLabelEn}]${publisher ? `. ${publisher}` : ""}.`.trim();
    }
    // book
    const pub = [place, publisher].filter(Boolean).join(": ");
    return `${a} (${year}). ${title}.${pub ? ` ${pub}.` : ""}`.trim();
  }

  if (style === "MLA") {
    // MLA 9th: Author. "Title." Source, Year.
    const a = authorInverted(author);
    if (item.type === "research") {
      const volIss = [vol && `vol. ${vol}`, iss && `no. ${iss}`].filter(Boolean).join(", ");
      return `${a}. "${title}." ${journal}${volIss ? `, ${volIss}` : ""}, ${year}.`.trim();
    }
    if (isThesis) {
      return `${a}. ${title}. ${year}. ${publisher || ""}, ${thesisLabelEn}.`.replace(/\s+,/g, ",").trim();
    }
    // book
    const pub = [place, publisher].filter(Boolean).join(": ");
    return `${a}. ${title}.${pub ? ` ${pub},` : ""} ${year}.`.trim();
  }

  // Chicago (Author-Date)
  const a = authorInverted(author);
  if (item.type === "research") {
    const volIss = vol ? `${vol}${iss ? `, no. ${iss}` : ""}` : "";
    return `${a}. ${year}. "${title}." ${journal}${volIss ? ` ${volIss}` : ""}.`.trim();
  }
  if (isThesis) {
    return `${a}. ${year}. "${title}." ${thesisLabel}${publisher ? `، ${publisher}` : ""}.`.trim();
  }
  const pub = [place, publisher].filter(Boolean).join(": ");
  return `${a}. ${year}. ${title}.${pub ? ` ${pub}.` : ""}`.trim();
}

export const CITATION_STYLES: CitationStyle[] = ["APA", "MLA", "Chicago"];