import type React from "react";
import { Box, Typography } from "@mui/material";
import type { NormalizedNode } from "../TreeLayout/normalizeData";

interface Props {
  node: NormalizedNode;
}

export const PersonCard = ({ node }: Props): React.JSX.Element => {
  return (
    <Box
      sx={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: 140,
        height: 65,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 2,
        p: 1,
      }}
    >
      <Typography variant="subtitle2">
        {node.firstName} {node.lastName}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {node.gender}
      </Typography>
    </Box>
  );
};
