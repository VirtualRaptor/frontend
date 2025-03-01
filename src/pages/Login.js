// frontend/src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        localStorage.setItem("userId", data.userId);
        alert("Zalogowano pomyślnie!");
        navigate("/"); // możesz też przekierować na "/quiz"
      }
    } catch (err) {
      console.log(err);
      alert("Błąd serwera");
    }
  };

  return (
    <div
      className="container text-center d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card p-4 shadow-lg" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="mb-3">Logowanie</h2>
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
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Zaloguj
        </button>

        <hr />
        <p>
          Nie masz konta?{" "}
          <a href="/register">Zarejestruj się</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
