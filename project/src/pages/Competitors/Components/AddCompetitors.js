import React, { useState } from "react";
import axios from "axios";
import styles from "./AddCompetitors.module.css";

const AddCompetitorModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    firstName: "",
    grade: "",
    birthDate: "",
    sex: "",
    weight: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const payload = {
        firstname: form.firstName,
        lastname: form.name,
        birthday: form.birthDate,
        club: "",
        country: "France",
        weight: parseFloat(form.weight),
        rank: form.grade,
        gender: form.sex === "Homme" ? "H" : "F"
      };

      await axios.post("http://localhost:3001/competitors", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // 🔄 Refetch the list after successful add
      onAdd(); 
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du compétiteur :", error);
      alert("Échec de l'ajout. Vérifiez la console pour plus de détails.");
    }
  };

  const handleImportCSV = () => {
    alert("Fonction d'importation CSV à implémenter.");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Ajouter un Compétiteur</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nom:
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Prénom:
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </label>
          <label>
            Grade:
            <select name="grade" value={form.grade} onChange={handleChange} required>
              <option value="">Sélectionner</option>
              <option value="Ceinture Blanche">Ceinture Blanche</option>
              <option value="Ceinture Jaune">Ceinture Jaune</option>
              <option value="Ceinture Orange">Ceinture Orange</option>
              <option value="Ceinture Verte">Ceinture Verte</option>
              <option value="Ceinture Bleue">Ceinture Bleue</option>
              <option value="Ceinture Marron">Ceinture Marron</option>
              <option value="Ceinture Noire">Ceinture Noire</option>
            </select>
          </label>
          <label>
            Date de Naissance:
            <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required />
          </label>
          <label>
            Sexe:
            <select name="sex" value={form.sex} onChange={handleChange} required>
              <option value="">Sélectionner</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </label>
          <label>
            Poids (kg):
            <input type="number" name="weight" value={form.weight} onChange={handleChange} required />
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Annuler
            </button>
            <button type="button" className={styles.import} onClick={handleImportCSV}>
              Importer CSV
            </button>
            <button type="submit" className={styles.confirm}>
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompetitorModal;
