import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaBrain, FaRegTired, FaSmileBeam } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const questions = [
  { text: "Czuję się wyczerpany/a w pracy.", icon: <FaRegTired style={{ color: "#ff5e57" }} /> },
  { text: "Nie mam energii do wykonywania obowiązków.", icon: <FaRegTired style={{ color: "#ff5e57" }} /> },
  { text: "Trudno mi się skupić.", icon: <FaBrain style={{ color: "#3498db" }} /> },
  { text: "Czuję, że nie mam kontroli nad swoją pracą.", icon: <FaBrain style={{ color: "#3498db" }} /> },
  { text: "Mam problem z motywacją.", icon: <FaRegTired style={{ color: "#f1c40f" }} /> },
  { text: "Jestem niezadowolony/a z pracy.", icon: <FaRegTired style={{ color: "#f1c40f" }} /> },
  { text: "Często jestem sfrustrowany/a w pracy.", icon: <FaRegTired style={{ color: "#ff5e57" }} /> },
  { text: "Odczuwam zmęczenie psychiczne.", icon: <FaRegTired style={{ color: "#ff5e57" }} /> },
  { text: "Czuję się emocjonalnie oderwany/a od pracy.", icon: <FaSmileBeam style={{ color: "#9b59b6" }} /> },
  { text: "Brakuje mi entuzjazmu do obowiązków zawodowych.", icon: <FaSmileBeam style={{ color: "#9b59b6" }} /> },
  { text: "Praca wydaje mi się bezsensowna.", icon: <FaBrain style={{ color: "#3498db" }} /> },
  { text: "Nie dbam już o jakość mojej pracy tak jak kiedyś.", icon: <FaBrain style={{ color: "#3498db" }} /> },
  { text: "Mam trudności w nawiązywaniu relacji w pracy.", icon: <FaSmileBeam style={{ color: "#9b59b6" }} /> },
  { text: "Czuję, że oddalam się od kolegów i koleżanek.", icon: <FaSmileBeam style={{ color: "#9b59b6" }} /> },
  { text: "Nie czuję więzi z moim miejscem pracy.", icon: <FaSmileBeam style={{ color: "#9b59b6" }} /> },
  { text: "Unikam kontaktów zawodowych, gdy to możliwe.", icon: <FaSmileBeam style={{ color: "#9b59b6" }} /> }
];

const options = [
  "Zdecydowanie się nie zgadzam",
  "Raczej się nie zgadzam",
  "Raczej się zgadzam",
  "Zdecydowanie się zgadzam"
];

function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sprawdzamy, czy user jest zalogowany
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  // Dane z Home.js
  const userData = location.state || {};
  console.log("📌 Otrzymane dane w Quiz.js:", userData);

  // Stany
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const totalQuestions = questions.length;

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  // Obliczanie postępu (w %)
  useEffect(() => {
    setProgress((Object.keys(answers).length / totalQuestions) * 100);
  }, [answers, totalQuestions]);

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleNext = () => {
    if (!answers[currentQuestionIndex]) {
      toast.error("⚠️ Wybierz jedną z odpowiedzi!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < totalQuestions) {
      toast.error("⚠️ Odpowiedz na wszystkie pytania!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
    // Przejście do ekranu wyników
    navigate("/results", { state: { ...userData, answers } });
  };

  const containerVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Tło
  const quizStyle = {
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    background: `url('/images/burnout-bg.png') no-repeat center center fixed`,
    backgroundSize: "cover",
    backgroundColor: darkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
    color: darkMode ? "#f0f0f0" : "#333",
    transition: "all 0.3s ease",
    backgroundBlendMode: "overlay",
  };

  return (
    <div style={quizStyle}>
      <ToastContainer />

      {/* Pasek postępu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backgroundColor: darkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.9)",
          transition: "background-color 0.3s ease",
        }}
      >
        <div className="progress" style={{ margin: 0, height: "6px" }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{
              width: `${progress}%`,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Przycisk jasny/ciemny */}
      <div style={{ padding: "10px", textAlign: "right" }}>
        <button
          className="btn btn-outline-secondary"
          onClick={toggleDarkMode}
        >
          {darkMode ? "Tryb Jasny" : "Tryb Ciemny"}
        </button>
      </div>

      <div
        className="card p-4 shadow-lg"
        style={{
          maxWidth: "600px",
          margin: "60px auto 0 auto",
          backgroundColor: darkMode ? "rgba(68,68,68,0.9)" : "rgba(255,255,255,0.9)",
          color: darkMode ? "#f0f0f0" : "#333",
          borderRadius: "12px",
          transition: "all 0.3s ease",
        }}
      >
        <h1 className="text-center mb-3">🧠 Test Wypalenia Zawodowego</h1>
        <p className="text-center text-muted">
          Pytanie {currentQuestionIndex + 1} z {totalQuestions}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <SingleQuestion
              questionIndex={currentQuestionIndex}
              question={questions[currentQuestionIndex]}
              options={options}
              selected={answers[currentQuestionIndex]}
              onAnswer={handleAnswerChange}
              darkMode={darkMode}
            />
          </motion.div>
        </AnimatePresence>

        <div className="d-flex justify-content-between mt-4">
          {currentQuestionIndex > 0 ? (
            <button className="btn btn-secondary" onClick={handlePrev}>
              Wstecz
            </button>
          ) : (
            <div />
          )}

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Dalej
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleNext}>
              Zakończ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SingleQuestion({ questionIndex, question, options, selected, onAnswer, darkMode }) {
  return (
    <div
      className="mb-4 p-3 border rounded"
      style={{
        backgroundColor: darkMode ? "rgba(85,85,85,0.8)" : "#f8f9fa",
        transition: "background-color 0.3s ease",
      }}
    >
      <p className="fw-bold">
        {questionIndex + 1}. {question.icon} {question.text}
      </p>
      <div className="btn-group-vertical w-100">
        {options.map((option, i) => (
          <motion.button
            key={i}
            className={`btn ${selected === i + 1 ? "btn-primary" : "btn-outline-primary"} mb-2`}
            whileHover={{ scale: 1.03 }}
            onClick={() => onAnswer(questionIndex, i + 1)}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;