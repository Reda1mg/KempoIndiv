import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:3001/forgot_Password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }), // Must match backend: { email }
    });

    if (response.ok) {
      setSubmitted(true);
    } else {
      const text = await response.text();
      console.error("Failed:", text);
    }
  } catch (err) {
    console.error("Error:", err);
  }
};


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Forgot Password</h2>
      {submitted ? (
        <p className={styles.message}>Check your email for a reset link.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.input}
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className={styles.button}>
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
