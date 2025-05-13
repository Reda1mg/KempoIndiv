import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const message = await res.text();
        alert("❌ Erreur : " + message);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);

      alert("✅ Connexion réussie !");
      navigate("/");
    } catch (err) {
      console.error("Erreur de connexion :", err);
      alert("❌ Erreur de connexion.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>Connexion</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={styles.linkRow}>
            <span
              className={styles.forgot}
              onClick={() => navigate("/forgot_password")}
            >
              Mot de passe oublié ?
            </span>
          </div>

          <button type="submit">Se connecter</button>
        </form>

        <button
          onClick={() => navigate("/register")}
          className={styles.switchBtn}
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
