import React, { useState } from "react";
import "./style/ResetPassword_style.css"; // <-- ton fichier CSS

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password?email=" + email, {
        method: "POST",
      });

      if (res.ok) {
        setMessage("📩 Un email de réinitialisation a été envoyé !");
      } else {
        setMessage("❌ Email introuvable");
      }
    } catch (error) {
      setMessage("⚠️ Erreur serveur");
    }
  };

  return (
    <div className="forgotPasswordCard">
      <div className="forgotPasswordBox">
        <h1>Mot de passe oublié</h1>
        <p>Entrez votre email pour recevoir un lien de réinitialisation</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="submitButton">
            <button type="submit">Envoyer</button>
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
