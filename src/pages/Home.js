import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Firebase
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

function Home() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    job: "",
    workHours: ""
  });

  // Modal zgody (RODO)
  const [showConsent, setShowConsent] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Flagi do sprawdzania, czy user może w ogóle zrobić test
  const [isEligible, setIsEligible] = useState(true);       // czy może wykonać test
  const [checkingEligibility, setCheckingEligibility] = useState(true); // czy trwa sprawdzanie

  // 1) Sprawdzamy w Firestore, czy user w ostatnim miesiącu już robił test
  useEffect(() => {
    const checkLastTestDate = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // Jeśli brak zalogowanego usera: 
          // - Możesz w tym miejscu ustalić, czy chcesz pozwolić na test anonimowo,
          //   czy zablokować, dopóki się nie zaloguje.
          setIsEligible(true);
          setCheckingEligibility(false);
          return;
        }

        // Obliczamy datę 30 dni wstecz
        const oneMonthAgoMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const oneMonthAgo = new Timestamp(Math.floor(oneMonthAgoMs / 1000), 0);

        // Zapytanie o najnowszy wynik usera
        const resultsRef = collection(db, "results");
        const q = query(
          resultsRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          // User nie ma żadnych wyników -> może
          setIsEligible(true);
        } else {
          // Sprawdzamy datę ostatniego testu
          const doc = snapshot.docs[0];
          const data = doc.data();
          const lastTestDate = data.createdAt; // Timestamp Firestore
          // Porównanie z oneMonthAgo
          if (lastTestDate.seconds > oneMonthAgo.seconds) {
            // Ostatni test zrobiony w ciągu ostatnich 30 dni -> blokada
            setIsEligible(false);
          } else {
            setIsEligible(true);
          }
        }
      } catch (err) {
        console.error("Błąd przy sprawdzaniu uprawnień:", err);
        // Na wypadek błędu pozwalamy
        setIsEligible(true);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkLastTestDate();
  }, []);

  // Zmiana pól formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Walidacja cyfr (age, workHours)
    if ((name === "age" || name === "workHours") && !/^\d*$/.test(value)) {
      toast.error("⚠️ Wprowadź tylko cyfry!", { position: "top-center", autoClose: 3000 });
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Kliknięcie "Rozpocznij test"
  const handleSubmit = () => {
    // Sprawdzenie wypełnienia pól
    if (!formData.name || !formData.age || !formData.job || !formData.workHours) {
      toast.error("⚠️ Wypełnij wszystkie pola!", { position: "top-center", autoClose: 3000 });
      return;
    }

    // Sprawdzamy, czy user jest uprawniony (w ciągu 30 dni nie robił testu)
    if (!isEligible) {
      toast.error("⚠️ Możesz wykonać test tylko raz na 30 dni!", {
        position: "top-center",
        autoClose: 5000
      });
      return;
    }

    // Jeśli wszystko OK -> pokazujemy modal ze zgodą
    setShowConsent(true);
  };

  // Obsługa przycisku "Kontynuuj" w modalu zgody
  const handleAcceptConsent = () => {
    if (!consentAccepted) {
      toast.error("⚠️ Musisz wyrazić zgodę, aby przejść dalej!", {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }
    // Reset flagi i przejście do quizu
    localStorage.removeItem("savedResult");
    navigate("/quiz", { state: formData });
  };

  // Jeśli wciąż trwa sprawdzanie uprawnień (np. zapytanie do Firestore) -> prosty loading
  if (checkingEligibility) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
        <h2 style={{ textAlign: "center", paddingTop: "100px" }}>
          Sprawdzam, czy możesz wykonać test...
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "url('/images/burnout-bg.png') no-repeat center center fixed",
        backgroundSize: "cover"
      }}
    >
      <ToastContainer />
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        
        {/* KARTA GŁÓWNA FORMULARZA */}
        <div className="card p-4 shadow-lg text-center" style={{ maxWidth: 500, width: "100%" }}>
          <h1 className="mb-3">📝 Test Wypalenia Zawodowego</h1>
          
          {/* Komunikat blokujący, jeśli user nie jest uprawniony */}
          {!isEligible && (
            <div className="alert alert-danger">
              Możesz wykonać test tylko raz na 30 dni. Spróbuj ponownie za jakiś czas.
            </div>
          )}

          <p className="mb-4">Wypełnij poniższe pola, aby rozpocząć test.</p>

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Imię"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEligible}
          />

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Wiek"
            name="age"
            value={formData.age}
            onChange={handleChange}
            disabled={!isEligible}
          />

          <select
            className="form-control mb-2"
            name="job"
            value={formData.job}
            onChange={handleChange}
            disabled={!isEligible}
          >
            <option value="">-- Wybierz zawód --</option>
            {/* Twój kod <optgroup> + <option> jak w oryginale */}
            <optgroup label="🏥 Branża Medyczna">
              <option value="lekarz">⚕️ Lekarz</option>
              <option value="pielęgniarka">🏩 Pielęgniarka</option>
              <option value="ratownik">🚑 Ratownik medyczny</option>
              <option value="fizjoterapeuta">🏋️ Fizjoterapeuta</option>
              <option value="psycholog">🧠 Psycholog</option>
              <option value="farmaceuta">💊 Farmaceuta</option>
              <option value="dentysta">🦷 Dentysta</option>
            </optgroup>
            <optgroup label="📚 Edukacja">
              <option value="nauczyciel">👨‍🏫 Nauczyciel</option>
              <option value="wykładowca">🎓 Wykładowca akademicki</option>
              <option value="przedszkolanka">🎨 Nauczyciel przedszkolny</option>
              <option value="doradca">💬 Pedagog szkolny/Doradca</option>
            </optgroup>
            <optgroup label="💻 IT & Biznes">
              <option value="programista">💻 Programista</option>
              <option value="tester">🧐 Tester oprogramowania</option>
              <option value="admin">🖥️ Administrator systemów</option>
              <option value="data_scientist">📊 Data Scientist</option>
              <option value="pracownik_korporacji">🏢 Pracownik korporacji</option>
              <option value="menedżer">📈 Menedżer</option>
              <option value="sekretarka">📝 Sekretarka</option>
              <option value="hr">🤝 Specjalista HR</option>
              <option value="księgowy">📑 Księgowy</option>
              <option value="analityk">📉 Analityk danych</option>
            </optgroup>
            <optgroup label="⚖️ Prawo i administracja">
              <option value="prawnik">⚖️ Prawnik</option>
              <option value="sędzia">👨‍⚖️ Sędzia</option>
              <option value="prokurator">🏛️ Prokurator</option>
              <option value="notariusz">📝 Notariusz</option>
              <option value="radca_prawny">📜 Radca prawny</option>
              <option value="adwokat">⚖️ Adwokat</option>
            </optgroup>
            <optgroup label="⚓ Praca morska">
              <option value="marynarz">🚢 Marynarz</option>
              <option value="kapitan">⚓ Kapitan statku</option>
              <option value="mechanik_morski">🔧 Mechanik morski</option>
              <option value="elektronik_morski">📡 Elektronik morski</option>
              <option value="oficer_pokładowy">🧭 Oficer pokładowy</option>
            </optgroup>
            <optgroup label="🏗️ Praca fizyczna">
              <option value="budowlaniec">🏗️ Pracownik budowlany</option>
              <option value="rolnik">🌱 Rolnik</option>
              <option value="kucharz">🍳 Kucharz</option>
              <option value="fryzjer">💇 Fryzjer</option>
              <option value="sprzedawca">🛍️ Sprzedawca</option>
            </optgroup>
            <option value="inne">🔹 Inne</option>
          </select>

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Liczba godzin pracy tygodniowo"
            name="workHours"
            value={formData.workHours}
            onChange={handleChange}
            disabled={!isEligible}
          />

          <button
            className="btn btn-primary mt-3 w-100"
            onClick={handleSubmit}
            disabled={!isEligible}
          >
            🚀 Rozpocznij test
          </button>
        </div>
      </div>

      {/* MODAL ZE ZGODĄ (POKAZYWANY PO WALIDACJI) */}
      {showConsent && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex", justifyContent: "center", alignItems: "center"
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "100%"
            }}
          >
            <h3>Zgoda na przetwarzanie danych</h3>
            <p>
              Wyrażam dobrowolną zgodę na gromadzenie i przetwarzanie moich danych 
              w celu przeprowadzenia badań, analiz oraz interpretacji wyników w 
              ramach projektu <strong>Test Wypalenia Zawodowego</strong>.
            </p>
            <ul>
              <li>W każdej chwili mam prawo wycofać swoją zgodę.</li>
              <li>Dane będą przechowywane przez czas niezbędny do realizacji projektu.</li>
              <li>Administratorem danych jest Nikodem Matlakiewicz. Kontakt: niko.mat@wp.pl</li>
            </ul>

            <label>
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
              />
              {" "}Zapoznałem(-am) się i akceptuję warunki przetwarzania danych.
            </label>
            <br />

            <button className="btn btn-success mt-3" onClick={handleAcceptConsent}>
              Kontynuuj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
