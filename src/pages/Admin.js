// src/pages/Admin.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function Admin() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("Brak zalogowanego użytkownika");
          return;
        }
        // Sprawdź, czy to admin
        if (user.email !== "nikodemus.mat@gmail.com") {
          setError("Brak uprawnień (nie jesteś adminem)");
          return;
        }

        // Pobieramy dokumenty z kolekcji "results", sort malejąco po createdAt
        const q = query(collection(db, "results"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const data = [];
        querySnapshot.forEach(doc => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setResults(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchResults();
  }, []);

  const getBurnoutLevel = (totalScore) => {
    if (totalScore < 20) return "Niski";
    if (totalScore < 40) return "Umiarkowany";
    return "Wysoki";
  };

  const filteredResults = results.filter(r => {
    const lowerTerm = searchTerm.toLowerCase();
    return (
      r.name?.toLowerCase().includes(lowerTerm) ||
      r.occupation?.toLowerCase().includes(lowerTerm) ||
      r.email?.toLowerCase().includes(lowerTerm)
    );
  });

  const handleDownloadCSV = () => {
    if (!filteredResults.length) {
      alert("Brak danych do wyeksportowania!");
      return;
    }

    const BOM = "\ufeff";
    let csv = BOM + "Data;Imię;Wiek;Zawód;Godziny pracy;Wynik (Total);Poziom wypalenia;Zmęczenie;Cynizm;Brak efektywności;UID;Email\n";

    filteredResults.forEach(r => {
      let createdAtStr = "";
      if (r.createdAt?.seconds) {
        createdAtStr = new Date(r.createdAt.seconds * 1000).toLocaleString();
      }
      const burnoutLevel = getBurnoutLevel(r.totalScore);

      const row = [
        `"${createdAtStr}"`,
        `"${r.name || ""}"`,
        `"${r.age || 0}"`,
        `"${r.occupation || ""}"`,
        `"${r.workHours || 0}"`,
        `"${r.totalScore || 0}"`,
        `"${burnoutLevel}"`,
        `"${r.exhaustionScore || 0}"`,
        `"${r.cynicismScore || 0}"`,
        `"${r.inefficacyScore || 0}"`,
        `"${r.userId || ""}"`,
        `"${r.email || ""}"`
      ].join(";");

      csv += row + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "results_export.csv";
    link.click();
    link.remove();
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
      <h1>Panel Administratora</h1>
      <p>Przegląd wyników testu wypalenia zawodowego.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Szukaj (imię, zawód, email)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="btn btn-primary mb-3" onClick={handleDownloadCSV}>
        Eksportuj widoczne wyniki do CSV
      </button>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Data</th>
            <th>Imię</th>
            <th>Wiek</th>
            <th>Zawód</th>
            <th>Godz. pracy</th>
            <th>Wynik (Total)</th>
            <th>Poziom wypalenia</th>
            <th>Zmęczenie</th>
            <th>Cynizm</th>
            <th>Brak efektywności</th>
            <th>UID</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((r) => {
            let createdAtStr = "";
            if (r.createdAt?.seconds) {
              createdAtStr = new Date(r.createdAt.seconds * 1000).toLocaleString();
            }
            const burnoutLevel = getBurnoutLevel(r.totalScore);

            return (
              <tr key={r.id}>
                <td>{createdAtStr}</td>
                <td>{r.name}</td>
                <td>{r.age}</td>
                <td>{r.occupation}</td>
                <td>{r.workHours}</td>
                <td>{r.totalScore}</td>
                <td>{burnoutLevel}</td>
                <td>{r.exhaustionScore}</td>
                <td>{r.cynicismScore}</td>
                <td>{r.inefficacyScore}</td>
                <td>{r.userId}</td>
                <td>{r.email}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
