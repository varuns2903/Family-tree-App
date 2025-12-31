import type React from "react";
import { PersonCard } from "../TreeNode/PersonCard";
import type { NormalizedNode } from "../TreeLayout/normalizeData";

interface Props {
  nodes: NormalizedNode[];
}

export const TreeRenderer = ({ nodes }: Props): React.JSX.Element => {
  return (
    <>
      {nodes.map(node => (
        <PersonCard key={node.id} node={node} />
      ))}
    </>
  );
};
