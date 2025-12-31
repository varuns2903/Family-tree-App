import type React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

interface AppLayoutProps {
  children: React.JSX.Element;
}

export const AppLayout = ({ children }: AppLayoutProps): React.JSX.Element => {
  const navigate = useNavigate();
  const logout = useAuthStore(s => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            Family Tree
          </Typography>

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
    </Box>
  );
};
