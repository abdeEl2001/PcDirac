import React, { useState } from "react";
import axios from "axios";
import './style/FormCours_style.css';

// Nested course data
const coursesData = {
  "Tronc Commun": {
    Physique: {
      "Mécanique": [
        "Gravitation universelle",
        "Actions mécaniques",
        "Mouvement",
        "Principe d'inertie",
        "Equilibre d'un corps sous l'action de deux forces",
        "Equilibre d'un corps sous l'action de trois forces non parallèles",
        "Equilibre d'un corps solide en rotation autour d’un axe fixe"
      ],
      "Électricité": [
        "Courant électrique continu",
        "Tension électrique",
        "Associations de conducteurs ohmiques",
        "Caractéristiques de dipôles passifs",
        "Caractéristiques de dipôles actifs"
      ]
    },
    Chimie: {
      "La chimie autour de nous": [
        "Espèces chimiques",
        "Extraction, séparation et identification des espèces chimiques",
        "Synthèse des espèces chimiques"
      ],
      "Constitution de la matière": [
        "Le modèle de l'atome",
        "La géométrie de quelques molécules",
        "Classification périodique des éléments chimiques",
        "La mole",
        "La concentration molaire"
      ],
      "Transformations de la matière": [
        "Modélisation des transformations chimiques - Bilan de la matière"
      ]
    }
  },
  "1ère Année Bac": {
    Physique: {
      "Mécanique": [
        "Rotation d'un solide indéformable autour d'un axe fixe",
        "Travail et puissance d'une force",
        "Travail et énergie cinétique",
        "Travail et énergie potentielle de pesanteur - Énergie mécanique",
        "Travail et énergie interne (Sciences Maths)",
        "Énergie thermique et transfert thermique (Sciences Maths)"
      ],
      "Électricité": [
        "Champ électrostatique (Sciences Maths)",
        "Énergie potentielle d'une charge électrique dans un champ électrique uniforme (Sciences Maths)",
        "Transfert d'énergie dans un circuit électrique - Comportement global d'un circuit électrique",
        "Le champ magnétique",
        "Le champ magnétique crée par un courant électrique",
        "Les forces électromagnétiques - La loi de Laplace"
      ],
      "Optique": [
        "Visibilité d'un objet",
        "Les images formées par un miroir plan",
        "Les images formées par une lentille mince convergente"
      ]
    },
    Chimie: {
      "Mesure en chimie": [
        "Importance de la mesure en chimie",
        "Grandeurs physiques liées à la quantité de matière",
        "La concentration et les solutions électrolytiques",
        "Suivi d'une transformation chimique",
        "Mesure des quantités de matière en solution par conductimétrie",
        "Les réactions acido-basiques",
        "Les dosages (ou titrages) directs"
      ],
      "Chimie organique": [
        "Expansion de la chimie organique",
        "Les molécules organiques et les squelettes carbonés",
        "Modification du squelette carboné",
        "Les groupes caractéristiques en chimie organique"
      ]
    }
  },
  "2éme Année Bac": {
    Physique: {
      "Ondes": [
        "Ondes mécaniques progressives",
        "Ondes mécaniques progressives périodiques",
        "Propagation des ondes lumineuses"
      ],
      "Physique nucléaire": [
        "Décroissance radioactive",
        "Noyaux, masse et énergie"
      ],
      "Electricité": [
        "Dipôle RC",
        "Dipôle RL",
        "Oscillations libres d'un circuit RLC série",
        "Circuit RLC série en régime sinusoïdal forcé",
        "Ondes électromagnétiques",
        "Modulation d'amplitude"
      ],
      "Mécanique": [
        "Lois de Newton",
        "Chute libre verticale d’un solide",
        "Mouvements plans",
        "Mouvement des satellites et des planètes",
        "Mouvement de rotation d’un solide autour d’un axe fixe",
        "Systèmes mécaniques oscillants",
        "Aspects énergétiques des oscillations mécaniques",
        "Atome et mécanique de Newton"
      ]
    },
    Chimie: {
      "Transformations lentes et transformations rapides": [
        "Transformations lentes et transformations rapides",
        "Suivi temporel d'une transformation chimique - Vitesse de réaction"
      ],
      "Transformations non totales d’un système": [
        "Transformations chimiques s'effectuant dans les 2 sens",
        "État d'équilibre d'un système chimique",
        "Transformations liées à des réactions acide-base",
        "Dosage acido-basique"
      ],
      "Sens d’évolution d’un système chimique": [
        "Évolution spontanée d'un système chimique",
        "Transformations spontanées dans les piles et production d'énergie",
        "Transformations forcées (Électrolyse)"
      ],
      "Méthodes de contrôle de l’évolution des systèmes chimique": [
        "Réactions d'estérification et d'hydrolyse",
        "Contrôle de l'évolution d'un système"
      ]
    }
  }
};

const AddCourseForm = () => {
  const [formData, setFormData] = useState({
    titre: "",
    niveau: "1ère Année Bac",
    categorie: "Cours",
    matiere: "",
    unite: "",
    ordre: "",
    miniature: null,
    pdf_fichier: null,
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [pdfName, setPdfName] = useState("");

  const userId = sessionStorage.getItem("userId");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "niveau") return { ...prev, niveau: value, matiere: "", unite: "", titre: "" };
      if (name === "matiere") return { ...prev, matiere: value, unite: "", titre: "" };
      if (name === "unite") return { ...prev, unite: value, titre: "" };
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files.length) return;
    setFormData({ ...formData, [name]: files[0] });

    if (name === "miniature") setThumbnailPreview(URL.createObjectURL(files[0]));
    if (name === "pdf_fichier") setPdfName(files[0].name);
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
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("userId", userId);

    try {
      const response = await axios.post(
        `https://api.pcdirac.com/api/courses`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess(response.data?.message || "Cours ajouté avec succès !");
      setError("");

      setFormData({
        titre: "",
        niveau: "1ère Année Bac",
        categorie: "Cours",
        matiere: "",
        unite: "",
        ordre: "",
        miniature: null,
        pdf_fichier: null,
      });
      setThumbnailPreview(null);
      setPdfName("");
    } catch (err) {
      console.error("Axios error:", err);
      setError(err.response?.data || "Erreur réseau ou inattendue lors de l'ajout du cours");
    }
  };

  const matieres = formData.niveau ? Object.keys(coursesData[formData.niveau]) : [];
  const unites = formData.matiere ? Object.keys(coursesData[formData.niveau][formData.matiere]) : [];
  const titresCours = formData.unite ? coursesData[formData.niveau][formData.matiere][formData.unite] : [];

  return (
    <div className="container_Form_cours">
      <header>
        <h1>Ajouter un Nouveau Cours</h1>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>

        {/* Niveau */}
        <div className="form-group">
          <label htmlFor="niveau">Niveau :</label>
          <select id="niveau" name="niveau" value={formData.niveau} onChange={handleChange} required>
            {Object.keys(coursesData).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
          </select>
        </div>

        {/* Catégorie */}
        <div className="form-group">
          <label htmlFor="categorie">Catégorie :</label>
          <select id="categorie" name="categorie" value={formData.categorie} onChange={handleChange} required>
            <option value="Cours">Cours</option>
            <option value="Exercices">Exercices</option>
            <option value="Activités">Activités</option>
            <option value="Devoirs surveillés">Devoirs surveillés</option>
            <option value="Documents pédagogiques">Documents pédagogiques</option>
            <option value="Examens Nationaux">Examens Nationaux</option>
          </select>
        </div>

        {/* Matière */}
        {formData.categorie !== "Examens Nationaux" && (
          <div className="form-group">
            <label htmlFor="matiere">Matière :</label>
            <select id="matiere" name="matiere" value={formData.matiere} onChange={handleChange} required>
              <option value="">-- Choisir une matière --</option>
              {matieres.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}

        {/* Unité */}
        {formData.categorie !== "Examens Nationaux" && (
          <div className="form-group">
            <label htmlFor="unite">Unité :</label>
            <select id="unite" name="unite" value={formData.unite} onChange={handleChange} required>
              <option value="">-- Choisir une unité --</option>
              {unites.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        )}

        {/* Titre du cours */}
        <div className="form-group">
          <label htmlFor="titre">Titre du Cours :</label>
          {formData.categorie === "Examens Nationaux" ? (
            <input
              type="text"
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
              className="inputAddCourse"
            />
          ) : (
            <select id="titre" name="titre" value={formData.titre} onChange={handleChange} required>
              <option value="">-- Choisir un titre --</option>
              {titresCours.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
            </select>
          )}
        </div>

        {/* Ordre */}
        <div className="form-group">
          <label htmlFor="ordre">Ordre du cours :</label>
          <input type="text" id="ordre" name="ordre" value={formData.ordre} onChange={handleChange} required className="inputAddCourse"/>
        </div>

        {/* Miniature */}
        <div className="form-group">
          <label htmlFor="miniature">Image Miniature :</label>
          <input type="file" id="miniature" name="miniature" accept="image/*" onChange={handleFileChange} required />
          {thumbnailPreview && <img src={thumbnailPreview} alt="Aperçu miniature" style={{ marginTop: "10px", maxWidth: "200px" }} />}
        </div>

        {/* PDF */}
        <div className="form-group">
          <label htmlFor="pdf_fichier">Fichier PDF :</label>
          <input type="file" id="pdf_fichier" name="pdf_fichier" accept=".pdf" onChange={handleFileChange} required />
          {pdfName && <p>Fichier sélectionné: {pdfName}</p>}
        </div>

        {/* Submit */}
        <button type="submit" className="add-course-btn">Enregistrer le Cours</button>
      </form>
    </div>
  );
};

export default AddCourseForm;
