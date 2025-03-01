// frontend/src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert("Sprawdź mail weryfikacyjny!");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      alert("Błąd serwera");
    }
  };

  return (
    <div className="container text-center mt-5" style={{ maxWidth: 500 }}>
      <h2>Rejestracja</h2>
      <input
        type="email"
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-2"
        placeholder="Hasło"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="btn btn-primary w-100" onClick={handleRegister}>
        Zarejestruj
      </button>
    </div>
  );
}

export default Register;
