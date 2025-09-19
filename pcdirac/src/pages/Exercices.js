import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css"; // generic reusable CSS

const BACKEND_URL = "https://api.pcdirac.com";
const exercicesData = {
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
        "Champ électrostatique",
        "Énergie potentielle d'une charge électrique dans un champ électrique uniforme",
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

const normalize = (s) => (s ? String(s).trim().toLowerCase() : "");

const uniqueSorted = (arr) =>
  Array.from(new Set(arr.filter(Boolean).map((s) => (typeof s === "string" ? s.trim() : s))))
    .sort((a, b) => a.localeCompare(b));

const Exercices = () => {
  const [Exercices, setExercices] = useState([]);
  const [niveauFilter, setNiveauFilter] = useState("");
  const [matiereFilter, setMatiereFilter] = useState("");
  const [uniteFilter, setUniteFilter] = useState("");
  const [ExerciceTitreFilter, setExercicesTitreFilter] = useState("");
  const [professeurFilter, setProfesseurFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch from API
  useEffect(() => {
    const fetchExercices = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/courses/etudiant/exercice`);
        if (!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        setExercices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setExercices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExercices();
  }, []);

  // ----------------------------
  // Build dropdown options:
  // prefer backend values (from Courses) but fallback to static coursesData if backend has none
  // ----------------------------

  // Matieres: from backend given selected niveau
  const matieresFromBackend = uniqueSorted(
    Exercices
      .filter(c => !niveauFilter || normalize(c.niveau) === normalize(niveauFilter))
      .map(c => c.matiere)
  );

  const matieresStatic = niveauFilter && exercicesData[niveauFilter]
    ? Object.keys(exercicesData[niveauFilter])
    : [];

  const matieresOptions = uniqueSorted([
  ...matieresFromBackend,
  ...matieresStatic
]);

  // Unites: from backend given selected niveau + matiere
  const unitesFromBackend = uniqueSorted(
    Exercices
      .filter(c =>
        (!niveauFilter || normalize(c.niveau) === normalize(niveauFilter)) &&
        (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter))
      )
      .map(c => c.unite)
  );

  const unitesStatic =
    niveauFilter && matiereFilter && exercicesData[niveauFilter] && exercicesData[niveauFilter][matiereFilter]
      ? Object.keys(exercicesData[niveauFilter][matiereFilter])
      : [];

  const unitesOptions = uniqueSorted([
    ...unitesFromBackend ,
    ...unitesStatic
  ])

  // Titres: from backend given niveau + matiere + unite
  const titresFromBackend = uniqueSorted(
    Exercices
      .filter(c =>
        (!niveauFilter || normalize(c.niveau) === normalize(niveauFilter)) &&
        (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter)) &&
        (!uniteFilter || normalize(c.unite) === normalize(uniteFilter))
      )
      .map(c => c.exercice_titre)
  );

  const titresStatic =
    niveauFilter && matiereFilter && uniteFilter &&
    exercicesData[niveauFilter] &&
    exercicesData[niveauFilter][matiereFilter] &&
    exercicesData[niveauFilter][matiereFilter][uniteFilter]
      ? exercicesData[niveauFilter][matiereFilter][uniteFilter]
      : [];

  const titresOptions = titresFromBackend.length ? titresFromBackend : uniqueSorted(titresStatic);
  


  // Professors
  const uniqueProfs = uniqueSorted(Exercices.map(c => c.professeur));

  // Filter displayed items — use normalized compare to avoid spaces/case mismatch
  const displayedItems = Exercices.filter(item => {
    return (
      (niveauFilter === "" || normalize(item.niveau) === normalize(niveauFilter)) &&
      (matiereFilter === "" || normalize(item.matiere) === normalize(matiereFilter)) &&
      (uniteFilter === "" || normalize(item.unite) === normalize(uniteFilter)) &&
      (ExerciceTitreFilter === "" || normalize(item.titre) === normalize(ExerciceTitreFilter)) &&
      (professeurFilter === "" || normalize(item.professeur) === normalize(professeurFilter))
    );
  });

  // handlers that reset dependent filters (like AddCourseForm)
  const handleNiveauChange = (val) => {
    setNiveauFilter(val);
    setMatiereFilter("");
    setUniteFilter("");
    setExercicesTitreFilter("");
  };
  const handleMatiereChange = (val) => {
    setMatiereFilter(val);
    setUniteFilter("");
    setExercicesTitreFilter("");
  };
  const handleUniteChange = (val) => {
    setUniteFilter(val);
    setExercicesTitreFilter("");
  };

  return (
    <div className="contentPage">
      <h1 className="pageTitle">Nos Exercices</h1>

      {loading ? (
        <p className="loadingText">Chargement des exercices...</p>
      ) : (
        <>
          {/* Filters Section */}
          <div className="filtersSection">
            {/* Niveau (from static keys or backend if you prefer) */}
            <select
              value={niveauFilter}
              onChange={(e) => handleNiveauChange(e.target.value)}
              className="filterSelect"
            >
              <option value="">Tous les niveaux</option>
              {/* keep options consistent: use union of backend values + static keys */}
              {[...new Set([
                ...Exercices.map(c => c.niveau).filter(Boolean).map(s => s.trim()),
                ...Object.keys(exercicesData)
              ])].map((lvl, idx) => (
                <option key={idx} value={lvl}>{lvl}</option>
              ))}
            </select>

            {/* Matière (dependent) */}
            <select
              value={matiereFilter}
              onChange={(e) => handleMatiereChange(e.target.value)}
              className="filterSelect"
            >
              <option value="">Matière</option>
              {matieresOptions.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>

            {/* Unité (dependent) */}
            <select
              value={uniteFilter}
              onChange={(e) => handleUniteChange(e.target.value)}
              className="filterSelect"
            >
              <option value="">Unité</option>
              {unitesOptions.map((u, idx) => (
                <option key={idx} value={u}>{u}</option>
              ))}
            </select>

            {/* Titre spécifique (dependent) */}
            <select
              value={ExerciceTitreFilter}
              onChange={(e) => setExercicesTitreFilter(e.target.value)}
              className="filterSelect"
            >
              <option value="">Titre d'Exercice</option>
              {titresOptions.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>

            {/* Professeur */}
            <select
              value={professeurFilter}
              onChange={(e) => setProfesseurFilter(e.target.value)}
              className="filterSelect"
            >
              <option value="">Tous les professeurs</option>
              {uniqueProfs.map((prof, idx) => (
                <option key={idx} value={prof}>{prof}</option>
              ))}
            </select>
          </div>

          {/* Items Grid */}
          <div className="itemsGrid">
            {displayedItems.length > 0 ? (
              displayedItems.map((item) => (
                <div key={item.id} className="itemCard">
                  {item.miniature && (
                    <img
                      src={`${BACKEND_URL}${item.miniature}`}
                      alt={item.titre}
                      className="itemThumbnail"
                    />
                  )}
                  <h3 className="itemTitle">{item.titre}</h3>
                  <p className="itemInfo"><strong>Niveau:</strong> {item.niveau}</p>
                  <p className="itemInfo"><strong>Matière:</strong> {item.matiere}</p>
                  <p className="itemInfo"><strong>Unité:</strong> {item.unite}</p>
                  <p className="itemInfo"><strong>Professeur:</strong> {item.professeur}</p>
                  <p className="itemDescription">{item.description}</p>
                  {item.pdf_fichier && (
                    <a
                      href={`${BACKEND_URL}${item.pdf_fichier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkAction"
                    >
                      <button className="btnAction">Voir l'Exercice</button>
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="noItemsText">Aucun exercice trouvé pour ces filtres.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Exercices;
