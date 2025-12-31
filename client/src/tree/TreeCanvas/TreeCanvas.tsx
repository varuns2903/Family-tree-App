import type React from "react";
import { Box } from "@mui/material";
import { normalizeMembers } from "../TreeLayout/normalizeData";
import { computeLayout } from "../TreeLayout/computeLayout";
import { TreeRenderer } from "../TreeRenderer/TreeRenderer";
import type { Member } from "../../types/member.types";

interface Props {
  members: Member[];
}

export const TreeCanvas = ({ members }: Props): React.JSX.Element => {
  const normalized = normalizeMembers(members);
  const laidOut = computeLayout(normalized);

  return (
    <Box
      sx={{
        width: "100%",
        height: "70vh",
        overflow: "auto",
        position: "relative",
        backgroundColor: "#f4f4f9",
      }}
    >
      <svg width="5000" height="2000" style={{ position: "absolute" }} />

      <TreeRenderer nodes={laidOut} />
    </Box>
  );
};
