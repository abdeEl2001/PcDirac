import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/ProfileForm_style.css";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    motDePasse: "",
    confirmerMotDePasse: "",
    photoProfil: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) return;

        const response = await axios.get(
          `https://api.pcdirac.com/api/users/profileInformation/${userId}`
        );

        const user = response.data;

        setFormData({
          prenom: user.prenom || "",
          nom: user.nom || "",
          email: user.email || "",
          telephone: user.numerotelephone || "",
          motDePasse:user.motdepasse || "",
          confirmerMotDePasse: user.motdepasse || "",
          photoProfil: null,
        });
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les informations du profil.");
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photoProfil: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    // Only append fields that have been modified
    const data = new FormData();
    if (formData.prenom) data.append("prenom", formData.prenom);
    if (formData.nom) data.append("nom", formData.nom);
    if (formData.email) data.append("email", formData.email);
    if (formData.telephone) data.append("numerotelephone", formData.telephone);
    if (formData.motDePasse) data.append("motdepasse", formData.motDePasse);
    if (formData.photoProfil) data.append("photoProfil", formData.photoProfil);

    try {
      await axios.put(
        `https://api.pcdirac.com/api/users/update/${userId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } ,
          withCredentials: true}
      );
      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <div className="container-profile">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h1>Modifier le Profil</h1>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-section">
          <div className="form-group">
            <label>Prénom :</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Nom :</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Numéro de Téléphone :</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Nouveau Mot de Passe :</label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirmer Mot de Passe :</label>
            <input
              type="password"
              name="confirmerMotDePasse"
              value={formData.confirmerMotDePasse}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Photo de Profil :</label>
            <input
              type="file"
              name="photoProfil"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Mettre à Jour
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
