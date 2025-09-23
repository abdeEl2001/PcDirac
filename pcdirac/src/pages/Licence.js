import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css"; // generic reusable CSS
import Footer from "../Footer";

const BACKEND_URL = "https://api.pcdirac.com";

const normalize = (s) => (s ? String(s).trim().toLowerCase() : "");
const uniqueSorted = (arr) =>
  Array.from(
    new Set(arr.filter(Boolean).map((s) => (typeof s === "string" ? s.trim() : s)))
  ).sort((a, b) => a.localeCompare(b));

const Licence = () => {
  const [Licence, setLicence] = useState([]);
  const [categorieFilter, setCategorieFilter] = useState("");
  const [matiereFilter, setMatiereFilter] = useState("");
  const [uniteFilter, setUniteFilter] = useState("");
  const [licenceTitreFilter, setLicenceTitreFilter] = useState("");
  const [professeurFilter, setProfesseurFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch courses from backend
  useEffect(() => {
    const fetchLicence = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/courses/etudiant/license`);
        if (!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        const licenceArray = Array.isArray(data) ? data : [];
        setLicence(licenceArray);

        // SET DEFAULT FILTERS to first backend item
        if (licenceArray.length > 0) {
          setCategorieFilter(licenceArray[0].categorie || "");
          setMatiereFilter(licenceArray[0].matiere || "");
          setUniteFilter(licenceArray[0].unite || "");
          setLicenceTitreFilter(licenceArray[0].titre || "");
          setProfesseurFilter(licenceArray[0].professeur || "");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setLicence([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLicence();
  }, []);

  // Catégorie options
  const categorieOptions = uniqueSorted(Licence.map((c) => c.categorie));

  // Matières options
  const matieresOptions = uniqueSorted(
    Licence.filter(
      (c) =>
        !categorieFilter || normalize(c.categorie) === normalize(categorieFilter)
    ).map((c) => c.matiere)
  );

  // Unites options
  const unitesOptions = uniqueSorted(
    Licence.filter(
      (c) =>
        (!categorieFilter || normalize(c.categorie) === normalize(categorieFilter)) &&
        (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter))
    ).map((c) => c.unite)
  );

  // Titres options
  const titresOptions = uniqueSorted(
    Licence.filter(
      (c) =>
        (!categorieFilter || normalize(c.categorie) === normalize(categorieFilter)) &&
        (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter)) &&
        (!uniteFilter || normalize(c.unite) === normalize(uniteFilter))
    ).map((c) => c.titre)
  );

  // Professors options
  const uniqueProfs = uniqueSorted(Licence.map((c) => c.professeur));

  // Filtered items displayed
  const displayedItems = Licence.filter((item) => {
    return (
      (categorieFilter === "" || normalize(item.categorie) === normalize(categorieFilter)) &&
      (matiereFilter === "" || normalize(item.matiere) === normalize(matiereFilter)) &&
      (uniteFilter === "" || normalize(item.unite) === normalize(uniteFilter)) &&
      (licenceTitreFilter === "" || normalize(item.titre) === normalize(licenceTitreFilter)) &&
      (professeurFilter === "" || normalize(item.professeur) === normalize(professeurFilter))
    );
  });

  // Handlers
  const handleCategorieChange = (val) => {
    setCategorieFilter(val);
    setMatiereFilter("");
    setUniteFilter("");
    setLicenceTitreFilter("");
  };
  const handleMatiereChange = (val) => {
    setMatiereFilter(val);
    setUniteFilter("");
    setLicenceTitreFilter("");
  };
  const handleUniteChange = (val) => {
    setUniteFilter(val);
    setLicenceTitreFilter("");
  };

  const getButtonLabel = (categorie) => {
    switch (categorie) {
      case "Cours Licence":
        return "Voir le cours";
      case "Travaux dirigés":
        return "Voir le TD";
      default:
        return "Voir le fichier";
    }
  };

  return (
    <div className="contentPage">
      <h1 className="pageTitle">Licence</h1>

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

            {/* Unité */}
            <select
              value={uniteFilter}
              onChange={(e) => handleUniteChange(e.target.value)}
              className="filterSelect"
            >
              {unitesOptions.map((u, idx) => (
                <option key={idx} value={u}>
                  {u}
                </option>
              ))}
            </select>

            {/* Titre */}
            <select
              value={licenceTitreFilter}
              onChange={(e) => setLicenceTitreFilter(e.target.value)}
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
                  <p className="itemInfo"><strong>Unité:</strong> {item.unite}</p>
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
      <Footer/>
    </div>
  );
};

export default Licence;
