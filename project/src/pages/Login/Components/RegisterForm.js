import React, { useState } from "react";
import styles from "./RegisterForm.module.css"; // adjust if needed

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("UTILISATEUR");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (response.ok) {
        alert("✅ Compte créé avec succès !");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("UTILISATEUR");
        // window.location.href = "/login";
      } else {
        const err = await response.json();
        alert("❌ Erreur : " + err.message);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("❌ Erreur de connexion au serveur.");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>Créer un compte</h3>

        <label>Nom d'utilisateur:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="adresse@email.com"
        />

        <label>Mot de passe:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Rôle:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="UTILISATEUR">Utilisateur</option>
          <option value="GESTIONNAIRE">Gestionnaire</option>
          <option value="ADMIN">Administrateur</option>
        </select>

        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default RegisterForm;
