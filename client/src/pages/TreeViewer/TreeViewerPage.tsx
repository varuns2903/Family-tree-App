import type React from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { TreeViewerLayout } from "./TreeViewerLayout";
import { MemberAPI } from "../../services/member.api";
import { TreeAPI } from "../../services/tree.api";

const TreeViewerPage = (): React.JSX.Element => {
  const { treeId } = useParams<{ treeId: string }>();

  const { data: tree, isLoading: treeLoading } = useQuery({
    queryKey: ["tree", treeId],
    queryFn: () => TreeAPI.getById(treeId!),
    enabled: !!treeId,
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["treeMembers", treeId],
    queryFn: () => MemberAPI.getTreeMembers(treeId!),
    enabled: !!treeId,
  });

  if (treeLoading || membersLoading) {
    return <Typography>Loading tree...</Typography>;
  }

  if (!tree || !Array.isArray(members)) {
    return <Typography>Failed to load tree members</Typography>;
  }

  return <TreeViewerLayout tree={tree} members={members} />;
};

export default TreeViewerPage;
