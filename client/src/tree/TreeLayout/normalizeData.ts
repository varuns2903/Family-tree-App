import type { Member } from "../../types/member.types";

export interface NormalizedNode extends Member {
  x?: number;
  y?: number;
}

export const normalizeMembers = (
  members: unknown
): NormalizedNode[] => {
  if (!Array.isArray(members)) {
    console.error("normalizeMembers received non-array:", members);
    return [];
  }

  const map = new Map<string, NormalizedNode>();

  members.forEach(m => {
    map.set(m.id, { ...m });
  });

  return Array.from(map.values());
};
