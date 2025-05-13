import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      setConfirmed(true);
      setMessage("✅ Password updated. You can now log in.");
    } else {
      setMessage("❌ Failed to reset password.");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Reset Your Password</h2>
      {confirmed ? (
        <p>{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            required
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "0.5rem", marginBottom: "1rem" }}
          />
          <br />
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            Update Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
