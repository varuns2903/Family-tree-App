import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export const ProtectedRoute = ({
  children,
}: {
  children: React.JSX.Element;
}): React.JSX.Element | null => {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return null; // or a spinner later
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
