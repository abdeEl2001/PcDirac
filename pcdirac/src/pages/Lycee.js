import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css";

const BACKEND_URL = "https://api.pcdirac.com";

const normalize = (s) => (s ? String(s).trim().toLowerCase() : "");
const uniqueSorted = (arr) =>
  Array.from(new Set(arr.filter(Boolean).map((s) => (typeof s === "string" ? s.trim() : s))))
    .sort((a, b) => a.localeCompare(b));

const Lycee = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [niveauFilter, setNiveauFilter] = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");
  const [matiereFilter, setMatiereFilter] = useState("");
  const [uniteFilter, setUniteFilter] = useState("");
  const [titreFilter, setTitreFilter] = useState("");
  const [professeurFilter, setProfesseurFilter] = useState("");

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/courses/etudiant/lycee`);
        const data = await response.json();
        const backendCourses = Array.isArray(data) ? data : [];
        setCourses(backendCourses);

        // Set default filters
        if (backendCourses.length) {
          setNiveauFilter(backendCourses[0].niveau || "");
          setCategorieFilter(backendCourses[0].categorie || "");
          setMatiereFilter(backendCourses[0].matiere || "");
          setUniteFilter(backendCourses[0].unite || "");
          setTitreFilter(backendCourses[0].titre || "");
          setProfesseurFilter(backendCourses[0].user || "");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des cours:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Dropdown options from backend
  const niveauxOptions = uniqueSorted(courses.map((c) => c.niveau));
  const categoriesOptions = uniqueSorted(
    courses.filter(c => !niveauFilter || normalize(c.niveau) === normalize(niveauFilter))
           .map((c) => c.categorie)
  );
  const matieresOptions = uniqueSorted(
    courses.filter(
      c => (!niveauFilter || normalize(c.niveau) === normalize(niveauFilter)) &&
           (!categorieFilter || normalize(c.categorie) === normalize(categorieFilter))
    ).map((c) => c.matiere)
  );
  const unitesOptions = uniqueSorted(
    courses.filter(
      c => (!niveauFilter || normalize(c.niveau) === normalize(niveauFilter)) &&
           (!categorieFilter || normalize(c.categorie) === normalize(categorieFilter)) &&
           (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter))
    ).map((c) => c.unite)
  );
  const titresOptions = uniqueSorted(
    courses.filter(
      c => (!niveauFilter || normalize(c.niveau) === normalize(niveauFilter)) &&
           (!categorieFilter || normalize(c.categorie) === normalize(categorieFilter)) &&
           (!matiereFilter || normalize(c.matiere) === normalize(matiereFilter)) &&
           (!uniteFilter || normalize(c.unite) === normalize(uniteFilter))
    ).map((c) => c.titre)
  );
  const profsOptions = uniqueSorted(courses.map((c) => c.user));

  // Filtered displayed items
  const displayedItems = courses.filter((item) => {
  return (
    (niveauFilter === "" || normalize(item.niveau) === normalize(niveauFilter)) &&
    (categorieFilter === "" || normalize(item.categorie) === normalize(categorieFilter)) &&
    (matiereFilter === "" || normalize(item.matiere) === normalize(matiereFilter)) &&
    (uniteFilter === "" || normalize(item.unite) === normalize(uniteFilter)) &&
    (titreFilter === "" || normalize(item.titre) === normalize(titreFilter)) &&
    (professeurFilter === "" || normalize(item.user) === normalize(professeurFilter))
  );
});


  const getButtonLabel = (categorie) => {
    switch (categorie) {
      case "Cours": return "Voir le cour";
      case "Exercices": return "Voir l'exercice";
      case "Activités": return "Voir l'activité";
      case "Devoirs surveillés": return "Voir le Devoir";
      case "Documents pédagogiques": return "Voir le Document";
      case "Examens Nationaux": return "Voir l'examen";
      default: return "Voir le fichier";
    }
  };

  return (
    <div className="contentPage">
      <h1 className="pageTitle">Lycée</h1>
      {loading ? (
        <p className="loadingText">Chargement des fichiers...</p>
      ) : (
        <>
          <div className="filtersSection">
            <select value={niveauFilter} onChange={(e) => setNiveauFilter(e.target.value)} className="filterSelect">
              <option value="">Tous les niveaux</option>
              {niveauxOptions.map((lvl, idx) => <option key={idx} value={lvl}>{lvl}</option>)}
            </select>

            <select value={categorieFilter} onChange={(e) => setCategorieFilter(e.target.value)} className="filterSelect">
              <option value="">Toutes les catégories</option>
              {categoriesOptions.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
            </select>

            <select value={matiereFilter} onChange={(e) => setMatiereFilter(e.target.value)} className="filterSelect">
              <option value="">Matière</option>
              {matieresOptions.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
            </select>

            <select value={uniteFilter} onChange={(e) => setUniteFilter(e.target.value)} className="filterSelect">
              <option value="">Unité</option>
              {unitesOptions.map((u, idx) => <option key={idx} value={u}>{u}</option>)}
            </select>

            <select value={titreFilter} onChange={(e) => setTitreFilter(e.target.value)} className="filterSelect">
              <option value="">Titre</option>
              {titresOptions.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
            </select>

            <select value={professeurFilter} onChange={(e) => setProfesseurFilter(e.target.value)} className="filterSelect">
              <option value="">Tous les professeurs</option>
              {profsOptions.map((prof, idx) => <option key={idx} value={prof}>{prof}</option>)}
            </select>
          </div>

          <div className="itemsGrid">
            {displayedItems.length > 0 ? (
              displayedItems.map((item) => (
                <div key={item.id} className="itemCard">
                  {item.miniature && <img src={`${BACKEND_URL}${item.miniature}`} alt={item.titre} className="itemThumbnail" />}
                  <h3 className="itemTitle">{item.titre}</h3>
                  <p className="itemInfo"><strong>Catégorie:</strong> {item.categorie}</p>
                  {item.categorie !== "Examens Nationaux" && (
                    <>
                      <p className="itemInfo"><strong>Niveau:</strong> {item.niveau}</p>
                      <p className="itemInfo"><strong>Matière:</strong> {item.matiere}</p>
                      <p className="itemInfo"><strong>Unité:</strong> {item.unite}</p>
                    </>
                  )}
                  <p className="itemInfo"><strong>Professeur:</strong> {item.user}</p>
                  {item.pdf_fichier && (
                    <a href={`${BACKEND_URL}${item.pdf_fichier}`} target="_blank" rel="noopener noreferrer">
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

export default Lycee;
