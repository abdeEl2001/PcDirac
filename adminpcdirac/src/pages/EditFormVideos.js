import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style/FormVideo_style.css";

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

// Agrégation categories requested
const agregationCategories = [
  "Concours d'entrée",
  "Concours de sortie",
  "Rapport de jury",
  "Leçons physique",
  "Leçons Chimie",
  "Montage physique"
];

// Filière mapping (Agrégation added)
const filiereData = {
  Lycée: lyceeData,
  Licence: { Physique: licencePhysiqueUnites, Chimie: licenceChimieUnites },
  Agrégation: {}
};

// ----------------- COMPONENT -----------------
const EditVideoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    etape: "",
    niveau: "",
    matiere: "",
    unite: "",
    titre: "",
    categorie: "Cours",
    ordre: "",
    miniature: null,
    lien: "",
  });

  const [miniatureFile, setMiniatureFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // fetch existing video
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`https://api.pcdirac.com/api/videos/${id}`);
        const data = response.data;
        setFormData({
          etape: data.etape || "",
          niveau: data.niveau || "",
          matiere: data.matiere || "",
          unite: data.unite || "",
          titre: data.titre || "",
          categorie: data.categorie || "Cours",
          ordre: data.ordre || "",
          miniature: data.miniature || null,
          lien: data.lien || "",
        });
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement de la vidéo");
      }
    };
    fetchVideo();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "etape" ? { niveau: "", matiere: "", unite: "", titre: "" } : {}),
      ...(name === "niveau" ? { matiere: "", unite: "", titre: "" } : {}),
      ...(name === "matiere" ? { unite: "", titre: "" } : {}),
      ...(name === "unite" ? { titre: "" } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) form.append(key, value);
      });
      if (miniatureFile) form.append("miniature", miniatureFile);

      await axios.put(`https://api.pcdirac.com/api/videos/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Vidéo modifiée avec succès !");
      setTimeout(() => navigate("/list-videos"), 1500);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification de la vidéo");
    }
  };

  // ----------------- DROPDOWN DATA -----------------
  const currentData = filiereData[formData.etape] || {};
  const niveaux = formData.etape === "Lycée" ? Object.keys(currentData) : [];

  let unites = [];
  if (formData.etape === "Lycée") {
    unites = formData.niveau && formData.matiere
      ? Object.keys(currentData[formData.niveau]?.[formData.matiere] || {})
      : [];
  } else if (formData.etape === "Licence") {
    unites = formData.matiere === "Physique"
      ? licencePhysiqueUnites
      : formData.matiere === "Chimie"
      ? licenceChimieUnites
      : [];
  }

  const titres = formData.etape === "Lycée"
    ? (formData.unite ? currentData[formData.niveau]?.[formData.matiere]?.[formData.unite] || [] : [])
    : [];

  return (
    <div className="container_Form_cours">
      <h1>Modifier la Vidéo</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Étape */}
        <div className="form-group-video">
          <label>Étape :</label>
          <select name="etape" value={formData.etape ?? ""} onChange={handleChange} required>
            <option value="">-- Sélectionner Étape --</option>
            {Object.keys(filiereData).map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
         {/* Niveau */}
            {formData.etape === "Lycée" && (
              <div className="form-group-video">
                <label>Niveau :</label>
                <select name="niveau" value={formData.niveau ?? ""} onChange={handleChange} required>
                  <option value="">-- Sélectionner Niveau --</option>
                  {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
         {/* Catégorie */}
          <div className="form-group-video">
            <label>Catégorie :</label>
            <select
              name="categorie"
              value={formData.categorie ?? "Cours"}
              onChange={handleChange}
              required
            >
              {formData.etape === "Agrégation"
                ? agregationCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                : formData.etape === "Licence"
                ? ["Cours Licence", "Travaux dirigés"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                : (
                  <>
                    <option value="Cours">Cours</option>
                    <option value="Exercices">Exercices</option>
                    <option value="Activités">Activités</option>
                    <option value="Devoirs surveillés">Devoirs surveillés</option>
                    <option value="Documents pédagogiques">Documents pédagogiques</option>
                    {/* Examens Nationaux uniquement si 2éme Année Bac */}
                    {formData.niveau === "2éme Année Bac" && (
                      <option value="Examens Nationaux">Examens Nationaux</option>
                    )}
                  </>
                )
              }
            </select>
          </div>

           
            {/* Matière, Unité → hide for Examens Nationaux */}
            {formData.categorie !== "Examens Nationaux" && (
          <>
            {formData.etape && (
              <div className="form-group-video">
                <label>Matière :</label>
                <select
                  name="matiere"
                  value={formData.matiere ?? ""}
                  onChange={handleChange}
                  required
                  disabled={formData.etape === "Lycée" && !formData.niveau}
                >
                  <option value="">-- Sélectionner Matière --</option>
                  <option value="Physique">Physique</option>
                  <option value="Chimie">Chimie</option>
                </select>
              </div>
            )}

            {(formData.etape === "Lycée" || formData.etape === "Licence") && (
              <div className="form-group-video">
                <label>Unité :</label>
                <select
                  name="unite"
                  value={formData.unite ?? ""}
                  onChange={handleChange}
                  required
                  disabled={formData.etape === "Lycée" ? (!formData.matiere || !formData.niveau) : !formData.matiere}
                >
                  <option value="">-- Sélectionner Unité --</option>
                  {unites.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            )}
          </>
        )}

        {/* Titre */}
        <div className="form-group-video">
          <label>Titre :</label>
          {formData.categorie !== "Examens Nationaux" && formData.etape === "Lycée" ? (
            <select
              name="titre"
              value={formData.titre ?? ""}
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
              value={formData.titre ?? ""}
              onChange={handleChange}
              required
            />
          )}
        </div>

        {/* Ordre */}
        <div className="form-group-video">
          <label>Ordre :</label>
          <input type="text" name="ordre" value={formData.ordre ?? ""} onChange={handleChange} required />
        </div>

        {/* Lien Vidéo */}
        <div className="form-group-video">
          <label>Lien Vidéo :</label>
          <input
            type="url"
            name="lien"
            value={formData.lien ?? ""}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </div>

        {/* Miniature */}
        <div className="form-group-video-edit-video">
          <label>Miniature actuelle :</label>
          {formData.miniature ? (
            <img src={`https://api.pcdirac.com${formData.miniature}`} alt="Miniature" width="120" />
          ) : <p>Aucune miniature</p>}
          <input type="file" accept="image/*" onChange={(e) => setMiniatureFile(e.target.files[0])} />
        </div>

        <button type="submit" className="add-course-btn">Sauvegarder les modifications</button>
      </form>
    </div>
  );
};

export default EditVideoForm;