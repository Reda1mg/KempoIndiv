import React, { useState } from "react";
import styles from "./CreateTournament.module.css";

const CreationTournoi = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [multiDay, setMultiDay] = useState(false);
  const [city, setCity] = useState("");
  const [club, setClub] = useState(""); // ✅ NEW STATE

  const [eliminationSystems, setEliminationSystems] = useState([]);
  const [importType, setImportType] = useState("");

  const handleCheckboxChange = (value, setFn, currentList) => {
    if (currentList.includes(value)) {
      setFn(currentList.filter(item => item !== value));
    } else {
      setFn([...currentList, value]);
    }
  };

  const calculateEndDate = (start) => {
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    return endDate.toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !date ||
      !city.trim() ||
      !club.trim() || // ✅ ADD CLUB VALIDATION
      eliminationSystems.length === 0 ||
      importType === ""
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Utilisateur non connecté.");
      return;
    }

    const tournamentData = {
      name: name,
      city: city,
      club: club, // ✅ INCLUDE CLUB
      start_date: date,
      end_date: multiDay ? calculateEndDate(date) : date,
    };

    try {
      const response = await fetch("http://localhost:3001/tournament/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tournamentData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Tournoi ajouté :", result);
        setIsOpen(false);
      } else {
        console.error("❌ Problème serveur :", await response.text());
      }
    } catch (err) {
      console.error("❌ Erreur réseau :", err);
    }
  };

  const handleReset = () => {
    setName("");
    setDate("");
    setCity("");
    setClub(""); // ✅ RESET CLUB
    setMultiDay(false);
    setEliminationSystems([]);
    setImportType("");
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button className={styles.openButton} onClick={() => setIsOpen(true)}>
        Créer un Tournoi
      </button>

      <div className={`${styles.modal} ${isOpen ? styles.modalOpen : ""}`}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h1>Création du tournoi</h1>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>

          <div className="space-y-4 mt-4">
            <div className={styles.formGroup}>
              <label>Insérer nom du tournoi :</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Lieu du tournoi :</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Club organisateur :</label> {/* ✅ CLUB INPUT */}
              <input
                type="text"
                value={club}
                onChange={e => setClub(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Date du tournoi :</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                required
              />
              <label className="flex items-center mt-2">
                <span className="text-red-500 text-sm">Tournoi sur plusieurs jours ?</span>
                <input
                  type="checkbox"
                  className="ml-2"
                  checked={multiDay}
                  onChange={e => setMultiDay(e.target.checked)}
                />
              </label>
            </div>

            <div className={styles.groupBox}>
              <label>SYSTÈME D'ÉLIMINATION <span className="text-red-500">*</span></label>
              {["Poules", "Élimination directe"].map(system => (
                <label key={system}>
                  <input
                    type="checkbox"
                    checked={eliminationSystems.includes(system)}
                    onChange={() => handleCheckboxChange(system, setEliminationSystems, eliminationSystems)}
                  />{" "}
                  {system}
                </label>
              ))}
            </div>

            <div className={styles.groupBox}>
              <label>IMPORTER LISTE PARTICIPANTS <span className="text-red-500">*</span></label>
              <label>
                <input
                  type="radio"
                  name="import"
                  checked={importType === "Manuellement"}
                  onChange={() => setImportType("Manuellement")}
                />{" "}
                Manuellement
              </label>
              <label>
                <input
                  type="radio"
                  name="import"
                  checked={importType === "Automatiquement"}
                  onChange={() => setImportType("Automatiquement")}
                />{" "}
                Automatiquement
              </label>
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.primaryBtn} onClick={handleSubmit}>
                Ajouter le tournoi
              </button>
              <button className={styles.secondaryBtn} onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreationTournoi;
