// src/PublicRoute.js
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase";

function PublicRoute({ children }) {
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
    return <div>Ładowanie...</div>;
  }

  // Jeśli użytkownik jest zalogowany (autentykowany), przekieruj do /home
  if (user) {
    return <Navigate to="/home" />;
  }

  return children;
}

export default PublicRoute;
