import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";

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
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/trees/:treeId",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <TreeViewerPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
]);
