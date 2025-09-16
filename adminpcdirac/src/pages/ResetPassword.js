import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./style/ResetPassword_style.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Token:", token);

    try {
      // Utiliser URLSearchParams pour le format attendu par le backend
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newPassword", password);

      const res = await fetch("https://api.pcdirac.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const data = await res.text();

      if (res.ok) {
        setMessage("✅ Mot de passe réinitialisé !");
        setTimeout(() => {
        navigate("/login");
        }, 1000);
      } else {
        setMessage("❌ " + data);
      }
    } catch (error) {
      setMessage("⚠️ Erreur serveur");
    }
  };

  return (
    <div className="resetPasswordCard">
      <div className="resetPasswordBox">
        <h1>Réinitialiser le mot de passe</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="submitButton">
            <button type="submit">Réinitialiser</button>
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
