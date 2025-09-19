import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css"; // generic reusable CSS

const BACKEND_URL = "https://api.pcdirac.com";

// ✅ Utility functions
const normalize = (s) => (s ? String(s).trim().toLowerCase() : "");
const uniqueSorted = (arr) =>
  Array.from(new Set(arr.filter(Boolean).map((s) => (typeof s === "string" ? s.trim() : s))))
    .sort((a, b) => a.localeCompare(b));

const Cours = () => {
  const [Courses, setCourses] = useState([]);
  const [niveauFilter, setNiveauFilter] = useState("");
  const [matiereFilter, setMatiereFilter] = useState("");
  const [uniteFilter, setUniteFilter] = useState("");
  const [coursTitreFilter, setCoursTitreFilter] = useState("");
  const [professeurFilter, setProfesseurFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/courses/etudiant/cours`);
        if (!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        console.log("Fetched courses:", data); // Debug
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ----------------------------
  // Build dropdown options
  // ----------------------------

  // Matieres
  const matieresOptions = uniqueSorted(
    Courses.filter((c) => !niveauFilter || normalize(c.niveau) === normalize(niveauFilter)).map(
      (c) => c.matiere
    )
  );

  // Unites
  const unitesOptions = uniqueSorted(
    Courses.filter(
      (c) =>
        (!niveauFilter || normalize(c.niveau) === normalize(niveauFilter)) &&
        (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter))
    ).map((c) => c.unite)
  );

  // Titres (✅ use cours_titre || titre)
  const titresOptions = uniqueSorted(
    Courses.filter(
      (c) =>
        (!niveauFilter || normalize(c.niveau) === normalize(niveauFilter)) &&
        (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter)) &&
        (!uniteFilter || normalize(c.unite) === normalize(uniteFilter))
    ).map((c) => c.cours_titre || c.titre)
  );

  // Professors
  const uniqueProfs = uniqueSorted(Courses.map((c) => c.professeur));

  // ✅ Filter displayed items
  const displayedItems = Courses.filter((item) => {
    const titre = item.cours_titre || item.titre;
    return (
      (niveauFilter === "" || normalize(item.niveau) === normalize(niveauFilter)) &&
      (matiereFilter === "" || normalize(item.matiere) === normalize(matiereFilter)) &&
      (uniteFilter === "" || normalize(item.unite) === normalize(uniteFilter)) &&
      (coursTitreFilter === "" || normalize(titre) === normalize(coursTitreFilter)) &&
      (professeurFilter === "" || normalize(item.professeur) === normalize(professeurFilter))
    );
  });

  // ✅ Reset dependent filters
  const handleNiveauChange = (val) => {
    setNiveauFilter(val);
    setMatiereFilter("");
    setUniteFilter("");
    setCoursTitreFilter("");
  };
  const handleMatiereChange = (val) => {
    setMatiereFilter(val);
    setUniteFilter("");
    setCoursTitreFilter("");
  };
  const handleUniteChange = (val) => {
    setUniteFilter(val);
    setCoursTitreFilter("");
  };

  return (
    <div className="contentPage">
      <h1 className="pageTitle">Nos Cours</h1>

      {loading ? (
        <p className="loadingText">Chargement des cours...</p>
      ) : (
        <>
          {/* ✅ Filters Section */}
          <div className="filtersSection">
            <select
              value={niveauFilter}
              onChange={(e) => handleNiveauChange(e.target.value)}
              className="filterSelect"
            >
              <option value="">Tous les niveaux</option>
              {uniqueSorted(Courses.map((c) => c.niveau)).map((lvl, idx) => (
                <option key={idx} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

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
              value={coursTitreFilter}
              onChange={(e) => setCoursTitreFilter(e.target.value)}
              className="filterSelect"
            >
              <option value="">Titre de Cours</option>
              {titresOptions.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>

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

          {/* ✅ Items Grid */}
          <div className="itemsGrid">
            {displayedItems.length > 0 ? (
              displayedItems.map((item) => {
                const titre = item.cours_titre || item.titre;
                return (
                  <div key={item.id} className="itemCard">
                    {item.miniature && (
                      <img
                        src={`${BACKEND_URL}${item.miniature}`}
                        alt={titre}
                        className="itemThumbnail"
                      />
                    )}
                    <h3 className="itemTitle">{titre}</h3>
                    <p className="itemInfo">
                      <strong>Niveau:</strong> {item.niveau}
                    </p>
                    <p className="itemInfo">
                      <strong>Matière:</strong> {item.matiere}
                    </p>
                    <p className="itemInfo">
                      <strong>Unité:</strong> {item.unite}
                    </p>
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
                        <button className="btnAction">Voir le cours</button>
                      </a>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="noItemsText">Aucun cours trouvé pour ces filtres.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cours;
