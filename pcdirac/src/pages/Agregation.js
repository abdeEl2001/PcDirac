import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css"; // generic reusable CSS

const BACKEND_URL = "https://api.pcdirac.com";

const normalize = (s) => (s ? String(s).trim().toLowerCase() : "");
const uniqueSorted = (arr) =>
  Array.from(
    new Set(arr.filter(Boolean).map((s) => (typeof s === "string" ? s.trim() : s)))
  ).sort((a, b) => a.localeCompare(b));

const Agregation = () => {
  const [Agregation, setAgregation] = useState([]);
  const [categorieFilter, setCategorieFilter] = useState("");
  const [matiereFilter, setMatiereFilter] = useState("");
  const [uniteFilter, setUniteFilter] = useState("");
  const [agregationTitreFilter, setAgregationTitreFilter] = useState("");
  const [professeurFilter, setProfesseurFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch courses from backend
  useEffect(() => {
    const fetchAgregation = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/courses/etudiant/agregation`);
        if (!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        const agregationArray = Array.isArray(data) ? data : [];
        setAgregation(agregationArray);

        // SET DEFAULT FILTERS to first backend item
        if (agregationArray.length > 0) {
          setCategorieFilter(agregationArray[0].categorie || "");
          setMatiereFilter(agregationArray[0].matiere || "");
          setUniteFilter(agregationArray[0].unite || "");
          setAgregationTitreFilter(agregationArray[0].titre || "");
          setProfesseurFilter(agregationArray[0].professeur || "");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setAgregation([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgregation();
  }, []);

  // Catégorie options
  const categorieOptions = uniqueSorted(Agregation.map((c) => c.categorie));

  // Matières options
  const matieresOptions = uniqueSorted(
    Agregation.filter(
      (c) =>
        !categorieFilter || normalize(c.categorie) === normalize(categorieFilter)
    ).map((c) => c.matiere)
  );

  // Titres options
  const titresOptions = uniqueSorted(
    Agregation.filter(
      (c) =>
        (!categorieFilter || normalize(c.categorie) === normalize(categorieFilter)) &&
        (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter)) &&
        (!uniteFilter || normalize(c.unite) === normalize(uniteFilter))
    ).map((c) => c.titre)
  );

  // Professors options
  const uniqueProfs = uniqueSorted(Agregation.map((c) => c.professeur));

  // Filtered items displayed
  const displayedItems = Agregation.filter((item) => {
    return (
      (categorieFilter === "" || normalize(item.categorie) === normalize(categorieFilter)) &&
      (matiereFilter === "" || normalize(item.matiere) === normalize(matiereFilter)) &&
      (uniteFilter === "" || normalize(item.unite) === normalize(uniteFilter)) &&
      (agregationTitreFilter === "" || normalize(item.titre) === normalize(agregationTitreFilter)) &&
      (professeurFilter === "" || normalize(item.professeur) === normalize(professeurFilter))
    );
  });

  // Handlers
  const handleCategorieChange = (val) => {
    setCategorieFilter(val);
    setMatiereFilter("");
    setUniteFilter("");
    setAgregationTitreFilter("");
  };
  const handleMatiereChange = (val) => {
    setMatiereFilter(val);
    setUniteFilter("");
    setAgregationTitreFilter("");
  };


  const getButtonLabel = (categorie) => {
    switch (categorie) {
      case "Concours d'entrée":
        return "Voir le concour";
      case "Concours de sortie":
        return "Voir le concour";
      case "Rapport de jury":
        return "Voir le rapport";
      case "Leçons physique":
        return "Voir le leçon";
      case "Leçons Chimie":
        return "Voir le leçon";
      case "Montage physique":
        return "Voir le montage";
      default:
        return "Voir le fichier";
    }
  };

  return (
    <div className="contentPage">
      <h1 className="pageTitle">Agrégation</h1>

      {loading ? (
        <p className="loadingText">Chargement des fichiers...</p>
      ) : (
        <>
          {/* Filters Section */}
          <div className="filtersSection">
            {/* Catégorie */}
            <select
              value={categorieFilter}
              onChange={(e) => handleCategorieChange(e.target.value)}
              className="filterSelect"
            >
              {categorieOptions.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Matière */}
            <select
              value={matiereFilter}
              onChange={(e) => handleMatiereChange(e.target.value)}
              className="filterSelect"
            >
              {matieresOptions.map((m, idx) => (
                <option key={idx} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Titre */}
            <select
              value={agregationTitreFilter}
              onChange={(e) => setAgregationTitreFilter(e.target.value)}
              className="filterSelect"
            >
              {titresOptions.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Professeur */}
            <select
              value={professeurFilter}
              onChange={(e) => setProfesseurFilter(e.target.value)}
              className="filterSelect"
            >
              {uniqueProfs.map((prof, idx) => (
                <option key={idx} value={prof}>
                  {prof}
                </option>
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

                  <p className="itemInfo"><strong>Catégorie:</strong> {item.categorie}</p>
                  <p className="itemInfo"><strong>Matière:</strong> {item.matiere}</p>
                  <p className="itemInfo"><strong>Professeur:</strong> {item.professeur}</p>
                  <p className="itemDescription">{item.description}</p>

                  {item.pdf_fichier && (
                    <a
                      href={`${BACKEND_URL}${item.pdf_fichier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="btnAction">{getButtonLabel(item.categorie)}</button>
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="noItemsText">Aucun fichier trouvé pour ces filtres.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Agregation;
