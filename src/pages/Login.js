import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Konfiguracja providera Google
  const googleProvider = new GoogleAuthProvider();

  // Logowanie przez Google – wywołuje popup logowania,
  // a po sukcesie zapisuje user.uid w localStorage i przekierowuje do strony głównej.
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Zalogowano przez Google:", user);
      localStorage.setItem("userId", user.uid);
      navigate("/home");
    } catch (error) {
      console.error("Błąd logowania przez Google:", error);
    }
  };

  // Logowanie przez email i hasło
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Próba logowania:", { email, password });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Zalogowano:", userCredential.user);
      localStorage.setItem("userId", userCredential.user.uid);
      navigate("/home");
    } catch (error) {
      console.error("Błąd logowania:", error.message);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-4 shadow-lg text-center"
        style={{ maxWidth: 400, width: "100%" }}
      >
        <h2 className="mb-3">Logowanie</h2>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Hasło"
            className="form-control mb-3"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-100 mb-2">
            Zaloguj się
          </button>
        </form>

        <button onClick={handleGoogleLogin} className="btn btn-outline-primary w-100">
          Zaloguj się przez Google
        </button>

        <hr style={{ margin: "20px 0" }} />

        <p>
          Nie masz konta? <a href="/register">Zarejestruj się</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
