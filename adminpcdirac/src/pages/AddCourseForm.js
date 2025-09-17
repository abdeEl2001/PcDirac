import React, { useState } from "react";
import axios from "axios";
import './style/FormCours_style.css';

const AddCourseForm = () => {
  const [formData, setFormData] = useState({
    titre: "",
    niveau: "1ère Année Bac",
    categorie: "Cours",
    matiere: "Physique",
    ordre: "",
    miniature: null,
    pdf_fichier: null,
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [pdfName, setPdfName] = useState("");

  const userId = sessionStorage.getItem("userId"); // logged-in user ID

  // Handle text/select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length === 0) return;

    setFormData({ ...formData, [name]: files[0] });

    if (name === "miniature") {
      setThumbnailPreview(URL.createObjectURL(files[0]));
    }
    if (name === "pdf_fichier") {
      setPdfName(files[0].name);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccess("");
  setError("");

  if (!userId) {
    setError("Utilisateur non connecté !");
    return;
  }

  const data = new FormData();
    data.append("titre", formData.titre);
    data.append("niveau", formData.niveau);
    data.append("categorie", formData.categorie);
    data.append("matiere", formData.matiere);
    data.append("ordre", formData.ordre);
    data.append("miniature", formData.miniature);       // ✅ matches
    data.append("pdf_fichier", formData.pdf_fichier);   // ✅ matches
    data.append("userId", userId);                      // ✅ matches
 // ⚠ Pass userId as FormData, NOT in URL

 try {
  const response = await axios.post(
    `https://api.pcdirac.com/api/courses`,
    data,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  setSuccess(response.data?.message || "Cours ajouté avec succès !");
  setError(""); // clear error
  console.log("Course added:", response.data);

  // Reset form
  setFormData({
    titre: "",
    niveau: "1ère Année Bac",
    categorie: "Cours",
    matiere: "Physique",
    ordre: "",
    miniature: null,
    pdf_fichier: null,
  });
  setThumbnailPreview(null);
  setPdfName("");

} catch (err) {
  console.error("Axios error:", err);

  // Only set error if there is actually a response from server
  if (err.response && err.response.data) {
    setError(err.response.data);
  } else {
    // Network or other Axios errors
    setError("Erreur réseau ou inattendue lors de l'ajout du cours");
  }
}

};


  return (
    <div className="container_Form_cours">
      <header>
        <h1>Ajouter un Nouveau Cours</h1>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Titre */}
        <div className="form-group">
          <label htmlFor="titre">Titre du Cours :</label>
          <input
            className="inputAddCourse"
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            required
          />
        </div>

        {/* Niveau */}
        <div className="form-group">
          <label htmlFor="niveau">Niveau :</label>
          <select
            id="niveau"
            name="niveau"
            value={formData.niveau}
            onChange={handleChange}
            required
          >
            <option value="1ère Année Bac">1ère Année Bac</option>
            <option value="2ème Année Bac">2ème Année Bac</option>
            <option value="Tronc Commun">Tronc Commun</option>
          </select>
        </div>

        {/* Catégorie */}
        <div className="form-group">
          <label htmlFor="categorie">Catégorie :</label>
          <select
            id="categorie"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            required
          >
            <option value="Cours">Cours</option>
            <option value="Exercices">Exercices</option>
            <option value="Activités">Activités</option>
            <option value="Devoirs surveillés">Devoirs surveillés</option>
          </select>
        </div>

        {/* Matière */}
        <div className="form-group">
          <label htmlFor="matiere">Matière :</label>
          <select
            id="matiere"
            name="matiere"
            value={formData.matiere}
            onChange={handleChange}
            required
          >
            <option value="Physique">Physique</option>
            <option value="Chimie">Chimie</option>
          </select>
        </div>

        {/* Ordre */}
        <div className="form-group">
          <label htmlFor="ordre">Ordre du cours :</label>
          <input
            className="inputAddCourse"
            type="text"
            id="ordre"
            name="ordre"
            value={formData.ordre}
            onChange={handleChange}
            required
          />
        </div>

        {/* Miniature */}
        <div className="form-group">
          <label htmlFor="miniature">Image Miniature :</label>
          <input
            className="inputAddCourse"
            type="file"
            id="miniature"
            name="miniature"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Aperçu miniatura"
              style={{ marginTop: "10px", maxWidth: "200px" }}
            />
          )}
        </div>

        {/* PDF */}
        <div className="form-group">
          <label htmlFor="pdf_fichier">Fichier PDF :</label>
          <input
            className="inputAddCourse"
            type="file"
            id="pdf_fichier"
            name="pdf_fichier"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
          {pdfName && <p>Fichier sélectionné: {pdfName}</p>}
        </div>

        {/* Submit */}
        <button type="submit" className="add-course-btn">
          Enregistrer le Cours
        </button>
      </form>
    </div>
  );
};

export default AddCourseForm;
