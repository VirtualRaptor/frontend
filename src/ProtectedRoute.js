// src/ProtectedRoute.js
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase";

function ProtectedRoute({ children }) {
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

  // Gdy nie ma użytkownika => przenosimy do logowania
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Gdy użytkownik istnieje, ale email nie jest zweryfikowany => wyświetlamy komunikat
  if (!user.emailVerified) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          textAlign: "center",
          fontFamily: '"Courier New", Courier, monospace'
        }}
      >
        <div style={{ padding: "20px", maxWidth: "600px" }}>
          <h3 style={{ marginBottom: "15px" }}>
            Twój email nie został jeszcze zweryfikowany.
          </h3>
          <p style={{ fontSize: "16px" }}>
            Sprawdź swoją skrzynkę pocztową i kliknij w link weryfikacyjny.<br />
            Następnie odśwież stronę lub zaloguj się ponownie.
          </p>
        </div>
      </div>
    );
  }

  // Jeśli użytkownik zalogowany i zweryfikowany => renderujemy zawartość chronioną
  return children;
}

export default ProtectedRoute;
