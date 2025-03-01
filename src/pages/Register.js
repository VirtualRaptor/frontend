import React, { useState } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login");
    } catch (error) {
      console.error("Błąd rejestracji:", error.message);
    }
  };

  return (
    <div>
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Hasło" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
};

export default Register;
