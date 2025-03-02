// src/AdminRoute.js
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase";

function AdminRoute({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return <div style={{ padding: "20px" }}>Ładowanie...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Sprawdzamy email
  if (user.email !== "nikodemus.mat@gmail.com") {
    return <Navigate to="/home" />;
  }

  return children;
}

export default AdminRoute;
