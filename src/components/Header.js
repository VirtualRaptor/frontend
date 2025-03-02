import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Nasłuch zmian stanu autentykacji
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userId");
      toast.success("Wylogowano!");
      // Po wylogowaniu przekierowujemy do ekranu logowania
      navigate("/login");
    } catch (error) {
      toast.error("Błąd podczas wylogowania");
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, right: 0, padding: "10px", zIndex: 1000 }}>
      {user ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f8f9fa",
            padding: "5px 10px",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          <span style={{ marginRight: "10px" }}>Zalogowany: {user.email}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
            Wyloguj
          </button>
        </div>
      ) : (
        <div
          style={{
            background: "#f8f9fa",
            padding: "5px 10px",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          Nie zalogowano
        </div>
      )}
    </div>
  );
}

export default Header;
