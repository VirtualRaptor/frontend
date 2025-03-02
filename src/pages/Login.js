import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("userId", result.user.uid);
      navigate("/home");
    } catch (error) {
      console.error("Błąd logowania przez Google:", error.message);
      toast.error(error.message, { position: "top-center", autoClose: 5000 });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userId", userCredential.user.uid);
      navigate("/home");
    } catch (error) {
      console.error("Błąd logowania:", error.code, error.message);
      let errorMessage;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Podany adres e-mail nie jest zarejestrowany.";
          break;
        case "auth/wrong-password":
          errorMessage = "Niepoprawne hasło.";
          break;
        case "auth/invalid-email":
          errorMessage = "Nieprawidłowy adres e-mail.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Podane dane logowania są nieprawidłowe.";
          break;
        default:
          errorMessage = error.message;
      }
      toast.error(errorMessage, { position: "top-center", autoClose: 5000 });
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

          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline-primary w-100"
          >
            Zaloguj się przez Google
          </button>

          <hr style={{ margin: "20px 0" }} />
          <p className="mt-2">
            Nie masz konta?{" "}
            <a href="/register">
              Zarejestruj się
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
