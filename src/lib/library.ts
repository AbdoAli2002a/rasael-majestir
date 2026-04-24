// Shared types & helpers for library items
export const ITEM_TYPES = {
  phd_thesis: "رسائل دكتوراه",
  master_thesis: "رسائل ماجستير",
  book: "كتب",
  research: "أبحاث علمية",
} as const;

export type ItemType = keyof typeof ITEM_TYPES;

export type LibraryItem = {
  id: string;
  type: ItemType;
  title: string;
  author: string;
  year: number | null;
  sub_category: string | null;
  supervisors: string | null;
  publication_place: string | null;
  publisher: string | null;
  journal_name: string | null;
  volume: string | null;
  issue: string | null;
  created_at: string;
  updated_at: string;
};

export const STATUS_LABEL = {
  pending: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
  returned: "مُعادة",
} as const;
