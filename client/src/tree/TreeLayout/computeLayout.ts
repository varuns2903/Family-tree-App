import type { NormalizedNode } from "./normalizeData";

export const computeLayout = (
  nodes: NormalizedNode[]
): NormalizedNode[] => {
  // TEMP: stack vertically (replace with real algorithm)
  return nodes.map((node, index) => ({
    ...node,
    x: 100,
    y: index * 120,
  }));
};
