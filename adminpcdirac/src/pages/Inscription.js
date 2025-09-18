import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style/Inscription_style.css";

const InscriptionCard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    motdepasse: "",
    motdepasseconfirmation: "",
    numerotelephone: "",
    photoprofile: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photoprofile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.motdepasse !== formData.motdepasseconfirmation) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      // 1️⃣ Check if email already exists
      const emailCheck = await axios.get(
        `https://api.pcdirac.com/api/users/check-email?email=${formData.email}`
      );

      if (emailCheck.data === true) {
        setError("Cet email est déjà utilisé !");
        return;
      }


      // 2️⃣ Send registration request
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const response = await axios.post(
        "https://api.pcdirac.com/api/users",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(
          "Inscription réussie ! Un email d'activation vous a été envoyé."
        );
        setFormData({
          prenom: "",
          nom: "",
          email: "",
          motdepasse: "",
          motdepasseconfirmation: "",
          numerotelephone: "",
          photoprofile: null,
        });
        setTimeout(() => {
        navigate("/login");
      }, 2000);
      }
    } catch (err) {
  // Try to get a proper message from the backend error
  const errorMessage =
    err.response?.data?.message || // if your backend sends { message: "..." }
    (typeof err.response?.data === "string" ? err.response.data : null) || // fallback if string
    "Erreur lors de l'inscription";

  setError(errorMessage);
  setSuccess("");
}

  };

  return (
    <div className="inscriptionCard">
      <form className="inscriptionInfoCard" onSubmit={handleSubmit}>
        <h1>Inscription</h1>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="nameComplet">
          <div className="firstName">
            <label>Prénom</label>
            <input
              className="inputInscription"
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="lastName">
            <label>Nom</label>
            <input
              className="inputInscription"
              type="text"
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="loginInfo">
          <div className="emailSection">
            <label>Email</label>
            <input
              className="inputInscription"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="passwordSection">
            <label>Mot de Passe</label>
            <input
              className="inputInscription"
              type="password"
              name="motdepasse"
              placeholder="Mot de Passe"
              value={formData.motdepasse}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="addOnes">
          <div className="passwordConfirmationSection">
            <label>Confirmer Mot De Passe</label>
            <input
              className="inputInscription"
              type="password"
              name="motdepasseconfirmation"
              placeholder="Confirmer Mot de Passe"
              value={formData.motdepasseconfirmation}
              onChange={handleChange}
              required
            />
          </div>
          <div className="phoneNumberSection">
            <label>Numéro Télèphone</label>
            <input
              className="inputInscription"
              type="text"
              name="numerotelephone"
              placeholder="Numéro Télèphone"
              value={formData.numerotelephone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="photoProfil">
          <label>Photo De profil :</label>
          <input
            className="inputInscriptionProfile"
            type="file"
            name="photoprofile"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="submitButton">
          <button type="submit">S'inscrire</button>
        </div>
      </form>

      <img className="logoInscription" src="/images/Navy Minimalist Letter D Logo.png" alt="Logo" />
    </div>
  );
};

export default InscriptionCard;
