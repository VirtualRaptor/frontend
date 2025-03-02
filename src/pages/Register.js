import React, { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Wysyłamy mail weryfikacyjny
      await sendEmailVerification(userCredential.user);
      toast.success("Konto utworzone! Sprawdź email i kliknij link weryfikacyjny.", { position: "top-center", autoClose: 5000 });
      navigate("/login");
    } catch (error) {
      console.error("Błąd rejestracji:", error.message);
      toast.error(error.message, { position: "top-center", autoClose: 5000 });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success("Zarejestrowano / Zalogowano przez Google!", { position: "top-center", autoClose: 3000 });
      // Możesz przenieść użytkownika na /home od razu:
      navigate("/home");
    } catch (error) {
      console.error("Błąd rejestracji przez Google:", error.message);
      toast.error(error.message, { position: "top-center", autoClose: 5000 });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "url('/images/burnout-bg.png') no-repeat center center fixed",
        backgroundSize: "cover"
      }}
    >
      <div 
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <ToastContainer />

        <div 
          className="card p-4 shadow-lg text-center"
          style={{ maxWidth: 400, width: "100%" }}
        >
          <h2 className="mb-3">Rejestracja</h2>
          <p className="mb-3">
            Aby utworzyć konto, wypełnij poniższe pola.
          </p>

          <form onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email"
              className="form-control mb-2"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Hasło (min. 6 znaków)"
              className="form-control mb-3"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary w-100 mb-2"
            >
              Zarejestruj się
            </button>
          </form>

          <button
            onClick={handleGoogleRegister}
            className="btn btn-outline-primary w-100"
          >
            Zarejestruj się przez Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
