import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/common/ProtectedRoute";

import Landing from "../pages/Landing";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard";
import TreeViewerPage from "../pages/TreeViewer/TreeViewerPage";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },

  { path: "/auth/login", element: <Login /> },
  { path: "/auth/register", element: <Register /> },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/trees/:treeId",
    element: (
      <ProtectedRoute>
        <TreeViewerPage />
      </ProtectedRoute>
    ),
  },
]);
