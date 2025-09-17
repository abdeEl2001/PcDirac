import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style/FormCours_style.css";

const EditCourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titre: "",
    niveau: "",
    categorie: "",
    matiere: "",
    ordre: "",
    miniature: null,
    pdf_fichier: null,
  });

  const [miniatureFile, setMiniatureFile] = useState(null);
  const [pdf_fichier, setPdfFichier] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch course by ID
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`https://api.pcdirac.com/api/courses/${id}`);
        setFormData(response.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du cours");
      }
    };
    fetchCourse();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit (PUT with multipart/form-data)
  const handleSubmit = async (e) => {
    e.preventDefault();
      
    const form = new FormData();
    form.append("titre", formData.titre);
    form.append("niveau", formData.niveau);
    form.append("categorie", formData.categorie);
    form.append("matiere", formData.matiere);
    form.append("ordre", formData.ordre);
    if (miniatureFile) form.append("miniature", miniatureFile);
    if (pdf_fichier) form.append("pdf_fichier", pdf_fichier);
    setError("");
    setSuccess("");

    try {

      await axios.put(`https://api.pcdirac.com/api/courses/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Cours modifié avec succès !");
      setTimeout(() => navigate("/list-cours"), 1500);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification du cours");
    }
  };
  
 


  return (
    <div className="container_Form_cours">
      <header>
        <h1>Modifier le Cours</h1>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="titre">Titre :</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            required
          />
        </div>

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
            <option value="Exercice">Exercice</option>
            <option value="Activité">Activité</option>
            <option value="Devoirs surveillés">Devoirs surveillés</option>
          </select>
        </div>

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

        <div className="form-group">
          <label htmlFor="ordre">Ordre :</label>
          <input
            type="text"
            id="ordre"
            name="ordre"
            value={formData.ordre}
            onChange={handleChange}
            required
          />
        </div>

        <label>Miniature actuelle :</label>
        {formData.miniature ? (
          <div>
            <img src={`https://api.pcdirac.com${formData.miniature}`} alt="Miniature" width="120" />
          </div>
        ) : (
          <p>Aucune miniature</p>
        )}
        <input type="file" accept="image/*" onChange={(e) => setMiniatureFile(e.target.files[0])} />

        <label>PDF actuel :</label>
        {formData.pdf_fichier ? (
          <a href={`https://api.pcdirac.com${formData.pdf_fichier}`} target="_blank" rel="noopener noreferrer">
            Voir PDF
          </a>
        ) : (
          <p>Aucun PDF</p>
        )}
        <input type="file" accept="application/pdf" onChange={(e) => setPdfFichier(e.target.files[0])} />

        <button type="submit" className="add-course-btn">
          Sauvegarder les modifications
        </button>
      </form>
    </div>
  );
};

export default EditCourseForm;
