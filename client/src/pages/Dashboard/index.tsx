import type React from "react";
import { Typography } from "@mui/material";

const Dashboard = (): React.JSX.Element => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography>
        Your family trees will appear here.
      </Typography>
    </div>
  );
};

export default Dashboard;
