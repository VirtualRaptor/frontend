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

  // Rejestracja przez e-mail i hasło
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Tworzymy użytkownika w Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Wysyłamy maila weryfikacyjnego
      await sendEmailVerification(userCredential.user);

      toast.success("Konto utworzone! Sprawdź email i kliknij link weryfikacyjny.", {
        position: "top-center",
        autoClose: 5000,
      });

      // Możesz zdecydować, czy od razu wylogować użytkownika czy nie.
      // Tu przekierowujemy do /login, żeby użytkownik zalogował się dopiero po weryfikacji.
      navigate("/login");
    } catch (error) {
      console.error("Błąd rejestracji:", error.message);
      let errorMessage;
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Dany adres e-mail jest już zarejestrowany.";
          break;
        case "auth/invalid-email":
          errorMessage = "Nieprawidłowy adres e-mail.";
          break;
        case "auth/weak-password":
          errorMessage = "Hasło musi mieć co najmniej 6 znaków.";
          break;
        default:
          errorMessage = error.message;
      }
      toast.error(errorMessage, { position: "top-center", autoClose: 5000 });
    }
    
  };

  // Rejestracja / logowanie przez Google
  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Dla Google weryfikacja emaila jest zwykle automatyczna, bo to zaufany provider
      // localStorage.setItem("userId", result.user.uid);
      toast.success("Zarejestrowano / Zalogowano przez Google!", { position: "top-center", autoClose: 3000 });
      navigate("/home");
    } catch (error) {
      console.error("Błąd rejestracji przez Google:", error.message);
      toast.error(error.message, { position: "top-center", autoClose: 5000 });
    }
  };

  return (
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
          Stwórz konto, aby móc rozpocząć test wypalenia zawodowego.
        </p>

        <form onSubmit={handleRegister}>
          <input 
            type="email" 
            className="form-control mb-2" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            className="form-control mb-3" 
            placeholder="Hasło (min. 6 znaków)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button 
            type="submit" 
            className="btn btn-primary w-100"
          >
            Zarejestruj się
          </button>
        </form>

        <hr />

        <button 
          onClick={handleGoogleRegister} 
          className="btn btn-outline-primary w-100 mb-3"
        >
          Zarejestruj się przez Google
        </button>

        <p>
          Masz już konto? <a href="/login">Zaloguj się</a>
        </p>
      </div>
    </div>
    
  );
  
}

export default Register;
