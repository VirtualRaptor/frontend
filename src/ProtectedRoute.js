// frontend/src/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");

  // Jeśli nie mamy userId, przekieruj na /login
  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  // W przeciwnym razie zwróć komponent docelowy
  return children;
}

export default ProtectedRoute;
