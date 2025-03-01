// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css"; // globalne style

function App() {
  return (
    <div
      style={{
        background: "url('/images/burnout-bg.png') no-repeat center center fixed",
        backgroundSize: "cover",
        minHeight: "100vh",
        margin: 0,
        padding: 0
      }}
    >
      <Router>
        <Routes>
          {/* Ekran startowy */}
          <Route path="/" element={<Home />} />

          {/* Logowanie / Rejestracja */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Quiz i wyniki */}
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
