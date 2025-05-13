import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./RegisterForm.module.css";

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
    <div className={styles.authBox}>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="adresse@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

    

        <button type="submit">Créer un compte</button>
      </form>
      <Link to="/login" className={styles.loginLink}>Connexion</Link>
    </div>
  );
};

export default RegisterForm;
