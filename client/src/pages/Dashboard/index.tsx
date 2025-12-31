import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TreeAPI } from "../../services/tree.api";
import { CreateTreeModal } from "../../components/modals/CreateTreeModal";
import type { Tree } from "../../types/tree.types";

const Dashboard = (): React.JSX.Element => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["trees"],
    queryFn: TreeAPI.list,
  });

  const ownedTrees = data?.ownedTrees ?? [];
  const sharedTrees = data?.sharedTrees ?? [];

  const handleCreate = async (name: string, description?: string) => {
    await TreeAPI.create(name, description);
    queryClient.invalidateQueries({ queryKey: ["trees"] });
    setOpen(false);
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Dashboard</Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Tree
        </Button>
      </Box>

      {isLoading && <Typography>Loading...</Typography>}

      {!isLoading && ownedTrees.length === 0 && (
        <Typography>No trees yet. Create one to begin.</Typography>
      )}

      {ownedTrees.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Your Trees
          </Typography>

          <Grid container spacing={2} mb={4}>
            {ownedTrees.map((tree: Tree) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tree.id}>
                <Card>
                  <CardActionArea
                    onClick={() => navigate(`/trees/${tree.id}`)}
                  >
                    <CardContent>
                      <Typography variant="h6">{tree.name}</Typography>
                      {tree.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {tree.description}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Divider />

      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Shared With You
        </Typography>

        {sharedTrees.length === 0 && (
          <Typography color="text.secondary">
            No shared trees yet.
          </Typography>
        )}
      </Box>

      <CreateTreeModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
      />
    </Box>
  );
};

export default Dashboard;
