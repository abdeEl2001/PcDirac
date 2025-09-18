import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style/LoginCard_style.css"; // your CSS file

const LoginCard = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post("https://api.pcdirac.com/api/auth/login", {
        email: email.trim().toLowerCase(),
        motdepasse: motdepasse.trim(),
      });
      // Instead of localStorage
      const { userId, email: userEmail } = response.data;
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("email", userEmail);


       // if you implement JWT
      setMessage("Connexion réussie ✅");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);



      // Optional: store login info if rememberMe checked
      if (rememberMe) {
        sessionStorage.setItem("email", email);
      } else {
        sessionStorage.removeItem("email");
      }

    } catch (err) {
  if (err.response) {
    if (err.response.status === 401) {
      setError("Email ou mot de passe incorrect ❌");
    } else if (err.response.status === 403) {
      setError("⚠️ Ce compte n'est pas encore activé. Vérifiez votre email !");
    } else {
      setError("Erreur serveur, veuillez réessayer");
    }
  } else {
    setError("Impossible de contacter le serveur");
  }
}
  };

  return (
    <div className="loginCard">
      <div className="loginCardInfo">
        <form onSubmit={handleSubmit}>
          <div className="connexionSide">
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <h1>Se Connecter</h1>

            <div className="emailSectionLogin">
              <label htmlFor="Email">Email</label>
              <input
                type="email"
                name="email"
                id="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="passwordSectionLogin">
              <label htmlFor="password">Mot de Passe</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Mot de Passe"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                required
              />
            </div>

            <div className="submitButton">
              <button type="submit">Se Connecter</button>
              <Link to="/inscription" className="buttonInscriptionMobile">
                Inscription
              </Link>
            </div>

            <div className="optionsToAdd">
              <div className="rememberMeSection">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label className="saveMe" htmlFor="rememberMe">
                  Enregistrer Ses informations
                </label>
              </div>
              <div className="forgotPassword">
                <Link to="/forgotPassword" className="mot_de_passe_oublier">
                  Mot de Passe Oublié ?
                </Link>
              </div>
            </div>
          </div>
        </form>

        <div className="inscriptionSide">
          <div className="paragraphInscription">
            <h2>Bienvenue Dans PhysicDirac</h2>
            <p>Vous n'avez pas de compte ?</p>
          </div>
          <Link to="/inscription" className="buttonInscription">
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
