import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    job: "",
    workHours: ""
  });

  // Ewentualnie możesz sprawdzać logowanie tutaj:
  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");
  //   if (!userId) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "age" || name === "workHours") && !/^\d*$/.test(value)) {
      toast.error("⚠️ Wprowadź tylko cyfry!", { position: "top-center", autoClose: 3000 });
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.age || !formData.job || !formData.workHours) {
      toast.error("⚠️ Wypełnij wszystkie pola!", { position: "top-center", autoClose: 3000 });
      return;
    }
    console.log("Dane przesyłane do quizu:", formData);
    navigate("/quiz", { state: formData });
  };

  return (
    <div 
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer />
      
      <div className="card p-4 shadow-lg text-center" style={{ maxWidth: 500, width: "100%" }}>
        <h1 className="mb-3">📝 Test Wypalenia Zawodowego</h1>
        <p className="mb-4">Wypełnij poniższe pola, aby rozpocząć test.</p>

        <input 
          type="text" 
          className="form-control mb-2" 
          placeholder="Imię" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          className="form-control mb-2" 
          placeholder="Wiek" 
          name="age" 
          value={formData.age} 
          onChange={handleChange} 
        />

        <select 
          className="form-control mb-2" 
          name="job" 
          value={formData.job} 
          onChange={handleChange}
        >
          <option value="">-- Wybierz zawód --</option>
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
          <optgroup label="💻 IT & Technologia">
            <option value="programista">💻 Programista</option>
            <option value="tester">🧐 Tester oprogramowania</option>
            <option value="admin">🖥️ Administrator systemów</option>
            <option value="uxui">🎨 UX/UI Designer</option>
            <option value="data_scientist">📊 Data Scientist</option>
          </optgroup>
          <optgroup label="⚖️ Prawo i administracja">
            <option value="notariusz">📝 Notariusz</option>
            <option value="prawnik">⚖️ Prawnik</option>
            <option value="sędzia">👨‍⚖️ Sędzia</option>
            <option value="prokurator">🏛️ Prokurator</option>
            <option value="radca_prawny">📜 Radca prawny</option>
            <option value="adwokat">⚖️ Adwokat</option>
          </optgroup>
          <optgroup label="⚒️ Praca fizyczna">
            <option value="budowlaniec">🏗️ Pracownik budowlany</option>
            <option value="mechanik">🔧 Mechanik</option>
            <option value="kurier">📦 Kurier</option>
            <option value="kelner">🍽️ Kelner</option>
            <option value="sprzedawca">🛍️ Sprzedawca</option>
            <option value="rolnik">🌾 Rolnik</option>
            <option value="kierowca">🚛 Kierowca ciężarówki</option>
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
        />

        <button 
          className="btn btn-primary mt-3 w-100" 
          onClick={handleSubmit}
        >
          🚀 Rozpocznij test
        </button>

      </div>
    </div>
  );
}

export default Home;
