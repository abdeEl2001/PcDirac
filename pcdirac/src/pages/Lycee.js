import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css";
import Footer from "../Footer";

const BACKEND_URL = "https://api.pcdirac.com";

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

const sortItems = (items) => {
  return [...items].sort((a, b) => {
    // If both have ordre → sort numerically
    if (a.ordre != null && b.ordre != null) {
      return a.ordre - b.ordre;
    }
    // If only one has ordre → prioritize it
    if (a.ordre != null) return -1;
    if (b.ordre != null) return 1;

    // Fallback: alphabetical by titre
    return (a.titre || "").localeCompare(b.titre || "");
  });
};
const Lycee = () => {
  const [Lycee, setLycee] = useState([]);
  const [niveauFilter, setNiveauFilter] = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");
  const [matiereFilter, setMatiereFilter] = useState("");
  const [uniteFilter, setUniteFilter] = useState("");
  const [lyceeTitreFilter, setLyceeTitreFilter] = useState("");
  const [professeurFilter, setProfesseurFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Save filters in localStorage
  useEffect(() => {
    sessionStorage.setItem(
      "lyceeFilters",
      JSON.stringify({
        niveau: niveauFilter,
        categorie: categorieFilter,
        matiere: matiereFilter,
        unite: uniteFilter,
        lyceeTitre: lyceeTitreFilter,
        professeur: professeurFilter,
      })
    );
  }, [
    niveauFilter,
    categorieFilter,
    matiereFilter,
    uniteFilter,
    lyceeTitreFilter,
    professeurFilter,
  ]);

  // Fetch courses from backend
  useEffect(() => {
    const fetchLycee = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/courses/etudiant/lycee`);
        const data = await response.json();
        const lyceeArray = Array.isArray(data) ? data : [];
        setLycee(lyceeArray);

        // Force default selections
        const defaultNiveau = lyceeArray.find(
          (c) => normalize(c.niveau) === "tronc commun"
        );
        const defaultMatiere =
          defaultNiveau?.matiere && normalize(defaultNiveau.matiere) === "physique"
            ? defaultNiveau.matiere
            : defaultNiveau?.matiere || "Physique";
        let defaultCategorie =
          defaultNiveau?.categorie && normalize(defaultNiveau.categorie) === "cours"
            ? defaultNiveau.categorie
            : defaultNiveau?.categorie || "Cours";

        if (
          defaultCategorie === "Examens Nationaux" &&
          defaultNiveau?.niveau !== "2éme Année Bac"
        ) {
          defaultCategorie = "Cours";
        }

        setNiveauFilter(defaultNiveau?.niveau || "Tronc Commun");
        setMatiereFilter(defaultMatiere);
        setCategorieFilter(defaultCategorie);

        // Reset others
        setUniteFilter("");
        setLyceeTitreFilter("");
        setProfesseurFilter("");
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setLycee([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLycee();
  }, []);

  // Category options
  const categorieOptions = uniqueSorted(Lycee.map((c) => c.categorie)).filter(
    (cat) => !(niveauFilter !== "2éme Année Bac" && cat === "Examens Nationaux")
  );
  const orderedCategorieOptions = [
    "Cours",
    ...categorieOptions.filter((cat) => cat !== "Cours"),
  ];

  // Matière options
  const matieresFromBackend = uniqueSorted(
    Lycee.filter(
      (c) =>
        (!niveauFilter || normalize(c.niveau) === normalize(niveauFilter)) &&
        (!categorieFilter || normalize(c.categorie) === normalize(categorieFilter))
    ).map((c) => c.matiere)
  );
  const matieresStatic =
    niveauFilter && coursesData[niveauFilter]
      ? Object.keys(coursesData[niveauFilter])
      : [];
  const matieresOptions = uniqueSorted([
    ...matieresFromBackend,
    ...matieresStatic,
  ]);

  // Unité options
  const unitesFromBackend = uniqueSorted(
    Lycee.filter(
      (c) =>
        (!niveauFilter || normalize(c.niveau) === normalize(niveauFilter)) &&
        (!categorieFilter || normalize(c.categorie) === normalize(categorieFilter)) &&
        (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter))
    ).map((c) => c.unite)
  );
  const unitesStatic =
    niveauFilter &&
    matiereFilter &&
    coursesData[niveauFilter] &&
    coursesData[niveauFilter][matiereFilter]
      ? Object.keys(coursesData[niveauFilter][matiereFilter])
      : [];
  const unitesOptions = uniqueSorted([...unitesFromBackend, ...unitesStatic]);

  // Titres options
  const titresFromBackend = uniqueSorted(
    Lycee.filter(
      (c) =>
        (!niveauFilter || normalize(c.niveau) === normalize(niveauFilter)) &&
        (!categorieFilter || normalize(c.categorie) === normalize(categorieFilter)) &&
        (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter)) &&
        (!uniteFilter || normalize(c.unite) === normalize(uniteFilter))
    ).map((c) => c.cours)
  );
  const titresStatic =
    niveauFilter &&
    matiereFilter &&
    uniteFilter &&
    coursesData[niveauFilter] &&
    coursesData[niveauFilter][matiereFilter] &&
    coursesData[niveauFilter][matiereFilter][uniteFilter]
      ? coursesData[niveauFilter][matiereFilter][uniteFilter]
      : [];
  const titresOptions =
    titresFromBackend.length ? titresFromBackend : uniqueSorted(titresStatic);

  // Professeurs
  const uniqueProfs = uniqueSorted(Lycee.map((c) => c.professeur));

  // Displayed items (sorted)
  const displayedItems = sortItems(
    Lycee.filter((item) => {
      return (
        (niveauFilter === "" ||
          normalize(item.niveau) === normalize(niveauFilter)) &&
        (categorieFilter === "" ||
          normalize(item.categorie) === normalize(categorieFilter)) &&
        (matiereFilter === "" ||
          normalize(item.matiere) === normalize(matiereFilter)) &&
        (uniteFilter === "" ||
          normalize(item.unite) === normalize(uniteFilter)) &&
        (lyceeTitreFilter === "" ||
          normalize(item.titre) === normalize(lyceeTitreFilter)) &&
        (professeurFilter === "" ||
          normalize(item.user) === normalize(professeurFilter))
      );
    })
  );

  // Handlers
  const handleNiveauChange = (val) => {
    setNiveauFilter(val);
    setCategorieFilter("");
    setMatiereFilter("");
    setUniteFilter("");
    setLyceeTitreFilter("");
  };
  const handleCategorieChange = (val) => {
    setCategorieFilter(val);
    setMatiereFilter("");
    setUniteFilter("");
    setLyceeTitreFilter("");
  };
  const handleMatiereChange = (val) => {
    setMatiereFilter(val);
    setUniteFilter("");
    setLyceeTitreFilter("");
  };
  const handleUniteChange = (val) => {
    setUniteFilter(val);
    setLyceeTitreFilter("");
  };

  const getButtonLabel = (categorie) => {
    switch (categorie) {
      case "Cours":
        return "Voir le cours";
      case "Exercices":
        return "Voir l'exercice";
      case "Activités":
        return "Voir l'activité";
      case "Devoirs surveillés":
        return "Voir le Devoir";
      case "Documents pédagogiques":
        return "Voir le Document";
      case "Examens Nationaux":
        return "Voir l'examen";
      default:
        return "Voir le fichier";
    }
  };

  return (
    <div className="pageContainer">
      <div className="contentPage">
        <h1 className="pageTitle">Lycée</h1>
        {loading ? (
          <p className="loadingText">Chargement des fichiers...</p>
        ) : (
          <>
            <div className="filtersSection">
              {/* Filters dropdowns (unchanged) */}
              <select
                value={niveauFilter}
                onChange={(e) => handleNiveauChange(e.target.value)}
                className="filterSelect"
              >
                <option value="">Tous les niveaux</option>
                {[
                  ...new Set([
                    ...Lycee.map((c) => c.niveau)
                      .filter(Boolean)
                      .map((s) => s.trim()),
                    ...Object.keys(coursesData),
                  ]),
                ].map((lvl, idx) => (
                  <option key={idx} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>

              <select
                value={categorieFilter}
                onChange={(e) => handleCategorieChange(e.target.value)}
                className="filterSelect"
              >
                <option value="">Toutes les catégories</option>
                {orderedCategorieOptions.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {categorieFilter !== "Examens Nationaux" && (
                <>
                  <select
                    value={matiereFilter}
                    onChange={(e) => handleMatiereChange(e.target.value)}
                    className="filterSelect"
                  >
                    <option value="">Matière</option>
                    {matieresOptions.map((m, idx) => (
                      <option key={idx} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    value={uniteFilter}
                    onChange={(e) => handleUniteChange(e.target.value)}
                    className="filterSelect"
                  >
                    <option value="">Unité</option>
                    {unitesOptions.map((u, idx) => (
                      <option key={idx} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>

                  <select
                    value={lyceeTitreFilter}
                    onChange={(e) => setLyceeTitreFilter(e.target.value)}
                    className="filterSelect"
                  >
                    <option value="">Titre</option>
                    {titresOptions.map((t, idx) => (
                      <option key={idx} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <select
                value={professeurFilter}
                onChange={(e) => setProfesseurFilter(e.target.value)}
                className="filterSelect"
              >
                <option value="">Tous les professeurs</option>
                {uniqueProfs.map((prof, idx) => (
                  <option key={idx} value={prof}>
                    {prof}
                  </option>
                ))}
              </select>
            </div>

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
                    <p className="itemInfo">
                      <strong>Catégorie:</strong> {item.categorie}
                    </p>
                    {item.categorie !== "Examens Nationaux" && (
                      <>
                        <p className="itemInfo">
                          <strong>Niveau:</strong> {item.niveau}
                        </p>
                        <p className="itemInfo">
                          <strong>Matière:</strong> {item.matiere}
                        </p>
                        <p className="itemInfo">
                          <strong>Unité:</strong> {item.unite}
                        </p>
                      </>
                    )}
                    <p className="itemInfo">
                      <strong>Professeur:</strong> {item.professeur}
                    </p>
                    <p className="itemDescription">{item.description}</p>
                    {item.pdf_fichier && (
                      <a
                        href={`${BACKEND_URL}${item.pdf_fichier}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="btnAction">
                          {getButtonLabel(item.categorie)}
                        </button>
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="noItemsText">
                  Aucun fichier trouvé pour ces filtres.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Lycee;


