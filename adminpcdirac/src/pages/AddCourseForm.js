import React, { useState } from "react";
import axios from "axios";
import './style/FormCours_style.css';

// ----------------- DATA -----------------
const lyceeData = {
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
        "Les réactions d'oxydo-réduction",
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


const licencePhysiqueUnites = [
  "Mécanique",
  "Électricité",
  "Électronique",
  "Optique",
  "Ondes",
  "Thermodynamique",
  "Transfert thermique"
];

const licenceChimieUnites = [
  "Chimie des solutions et liaisons chimiques",
  "Atomistique",
  "Électrochimie",
  "Chimie Organique",
  "Cinétique et catalyse"
];

// Filiere mapping
const filiereData = {
  Lycée: lyceeData,
  Licence: {},
  Agrégation: {}
};

const AddCourseForm = () => {
  const [formData, setFormData] = useState({
    etape: "",
    niveau: "",
    matiere: "",
    unite: "",
    titre: "",
    categorie: "",
    ordre: "",
    miniature: null,
    pdf_fichier: null
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const userId = sessionStorage.getItem("userId");

  // --- category defaults ---
  const getDefaultCategorie = (etape) => {
    if (etape === "Licence") return "Cours Licence";
    if (etape === "Agrégation") return "Concours d'entrée";
    if (etape === "Lycée") return "Cours";
    return "";
  };

  const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === "etape") {
        setFormData((prev) => ({
          ...prev,
          etape: value,
          niveau: "",
          matiere: "",
          unite: "",
          titre: "",
          categorie: getDefaultCategorie(value),
        }));
      } else if (name === "categorie" && value === "Examens Nationaux") {
        setFormData((prev) => ({
          ...prev,
          categorie: value,
          matiere: "",
          unite: "",
        }));
      } else if (name === "niveau") {
        setFormData((prev) => ({ ...prev, niveau: value, matiere: "", unite: "", titre: "" }));
      } else if (name === "matiere") {
        setFormData((prev) => ({ ...prev, matiere: value, unite: "", titre: "" }));
      } else if (name === "unite") {
        setFormData((prev) => ({ ...prev, unite: value, titre: "" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files.length) return;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
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

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      data.append("userId", userId);

      const response = await axios.post(
        "https://api.pcdirac.com/api/courses",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess(response.data?.message || "Cours ajouté avec succès !");
      setFormData({
        etape: "",
        niveau: "",
        matiere: "",
        unite: "",
        titre: "",
        categorie: "",
        ordre: "",
        miniature: null,
        pdf_fichier: null
      });
      setThumbnailPreview(null);
      setPdfName("");
    } catch (err) {
      setError(err.response?.data || "Erreur lors de l'ajout du cours");
    }
  };

  // ----------------- DROPDOWN DATA -----------------
  const currentData = filiereData[formData.etape] || {};
  const niveaux = Object.keys(currentData);

  const unites = formData.etape === "Lycée"
    ? formData.matiere
      ? Object.keys(currentData[formData.niveau]?.[formData.matiere] || {})
      : formData.niveau
        ? Object.keys(currentData[formData.niveau] || {})
        : []
    : formData.etape === "Licence"
      ? formData.matiere === "Physique"
        ? licencePhysiqueUnites
        : formData.matiere === "Chimie"
          ? licenceChimieUnites
          : []
      : []; // Agrégation: no unite

  const titres = formData.etape === "Lycée"
    ? formData.unite
      ? currentData[formData.niveau][formData.matiere][formData.unite] || []
      : []
    : [];

  // ----------------- JSX -----------------
  return (
  <div className="container_Form_cours">
    <h1>Ajouter un Nouveau Cours</h1>

    {error && <div className="alert alert-danger">{error}</div>}
    {success && <div className="alert alert-success">{success}</div>}

    <form onSubmit={handleSubmit}>
      {/* Étape */}
      <div className="form-group-cours">
        <label>Étape :</label>
        <select name="etape" value={formData.etape} onChange={handleChange} required>
          <option value="">-- Sélectionner Étape --</option>
          <option value="Lycée">Lycée</option>
          <option value="Licence">Licence</option>
          <option value="Agrégation">Agrégation</option>
        </select>
      </div>
      
      {/* Niveau (only Lycée) */}
          {formData.etape === "Lycée" && (
            <div className="form-group-cours">
              <label>Niveau :</label>
              <select
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
                required
                disabled={!formData.etape}
              >
                <option value="">-- Sélectionner Niveau --</option>
                {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}

      {/* Catégorie */}
      <div className="form-group-cours">
        <label>Catégorie :</label>
        <select
          name="categorie"
          value={formData.categorie}
          onChange={handleChange}
          required
        >
          {formData.etape === "Licence" ? (
            <>
              <option value="Cours Licence">Cours Licence</option>
              <option value="Travaux dirigés">Travaux dirigés</option>
            </>
          ) : formData.etape === "Agrégation" ? (
            <>
              <option value="Concours d'entrée">Concours d'entrée</option>
              <option value="Concours de sortie">Concours de sortie</option>
              <option value="Rapport de jury">Rapport de jury</option>
              <option value="Leçons physique">Leçons physique</option>
              <option value="Leçons Chimie">Leçons Chimie</option>
              <option value="Montage physique">Montage physique</option>
            </>
          ) : (
            <>
              <option value="Cours">Cours</option>
              <option value="Exercices">Exercices</option>
              <option value="Activités">Activités</option>
              <option value="Devoirs surveillés">Devoirs surveillés</option>
              <option value="Documents pédagogiques">Documents pédagogiques</option>
              {/* 👇 Examens Nationaux uniquement si niveau = 2éme Année Bac */}
              {formData.niveau === "2éme Année Bac" && (
                <option value="Examens Nationaux">Examens Nationaux</option>
              )}
            </>
          )}
        </select>
      </div>

      {/*Matière, Unité (masquer si Examens Nationaux) */}
          {/* Matière */}
          {formData.categorie !== "Examens Nationaux" && (
        <>
          {formData.etape && (
            <div className="form-group-cours">
              <label>Matière :</label>
              <select
                name="matiere"
                value={formData.matiere}
                onChange={handleChange}
                required
                disabled={formData.etape === "Lycée" && !formData.niveau}
              >
                <option value="">-- Sélectionner Matière --</option>
                {["Physique", "Chimie"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}

          {/* Unité */}
          {(formData.etape === "Lycée" || formData.etape === "Licence") && (
            <div className="form-group-cours">
              <label>Unité :</label>
              <select
                name="unite"
                value={formData.unite}
                onChange={handleChange}
                required={formData.etape !== "Agrégation"}
                disabled={!formData.matiere}
              >
                <option value="">-- Sélectionner Unité --</option>
                {unites.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          )}
        </>
      )}
      {/* Titre */}
      <div className="form-group-cours">
        <label>Titre :</label>
        {formData.categorie !== "Examens Nationaux" && formData.etape === "Lycée" ? (
          <select
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            required
            disabled={!formData.unite}
          >
            <option value="">-- Sélectionner Titre --</option>
            {titres.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        ) : (
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            required
          />
        )}
      </div>

      {/* Ordre */}
      <div className="form-group-cours">
        <label>Ordre du cours :</label>
        <input
          type="text"
          name="ordre"
          value={formData.ordre}
          onChange={handleChange}
          required
        />
      </div>

      {/* Miniature */}
      <div className="form-group-cours">
        <label>Image Miniature :</label>
        <input
          type="file"
          name="miniature"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        {thumbnailPreview && <img src={thumbnailPreview} alt="Aperçu miniature" style={{ marginTop: 10, maxWidth: 200 }} />}
      </div>

      {/* PDF */}
      <div className="form-group-cours">
        <label>Fichier PDF :</label>
        <input
          type="file"
          name="pdf_fichier"
          accept=".pdf"
          onChange={handleFileChange}
          required
        />
        {pdfName && <p>Fichier sélectionné: {pdfName}</p>}
      </div>

      {/* Submit */}
      <button type="submit" className="add-course-btn">Enregistrer le Cours</button>
    </form>
  </div>
);
};

export default AddCourseForm;