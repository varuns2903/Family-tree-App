import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string) => void;
}

export const CreateTreeModal = ({
  open,
  onClose,
  onCreate,
}: Props): React.JSX.Element => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), description.trim() || undefined);
    setName("");
    setDescription("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Tree</DialogTitle>

      <DialogContent>
        <TextField
          label="Tree Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          minRows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
