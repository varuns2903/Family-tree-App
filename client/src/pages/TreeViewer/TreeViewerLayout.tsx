import type React from "react";
import { Box, Typography } from "@mui/material";
import { TreeCanvas } from "../../tree/TreeCanvas/TreeCanvas";
import type { Tree } from "../../types/tree.types";
import type { Member } from "../../types/member.types";

interface Props {
  tree: Tree;
  members: Member[];
}

export const TreeViewerLayout = ({
  tree,
  members,
}: Props): React.JSX.Element => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {tree.name}
      </Typography>

      <TreeCanvas members={members} />
    </Box>
  );
};
