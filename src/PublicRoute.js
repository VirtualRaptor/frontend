// frontend/src/PublicRoute.js

import React from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const userId = localStorage.getItem("userId");
  // Jeśli jest userId, przekieruj na "/home" lub inną ścieżkę
  if (userId) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

export default PublicRoute;
