import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("🔑 Próba logowania:", { email, password });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Zalogowano:", userCredential.user);

      // Zapisz ID użytkownika w localStorage
      localStorage.setItem("userId", userCredential.user.uid);

      // Przekierowanie do Home.js
      navigate("/home");
    } catch (error) {
      console.error("❌ Błąd logowania:", error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Logowanie</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Hasło" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Zaloguj się</button>
      </form>
    </div>
  );
};

export default Login;
