import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css";

const BACKEND_URL = "http://pcdirac.com:8080";

const Exercices = () => {
  const [Exercices, setExercices] = useState([]);
  const [niveauFilter, setNiveauFilter] = useState("");
  const [professeurFilter, setProfesseurFilter] = useState("");
  const [matiereFilter,setMatiereFilter]=useState("");
  const [loading, setLoading] = useState(true);

  // Fetch exercices from API
  useEffect(() => {
    const fetchExercices = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/courses/etudiant/exercice`);
        if (!response.ok) {
          throw new Error("Erreur réseau");
        }
        const data = await response.json();
        setExercices(data);
      } catch (error) {
        console.error("Erreur lors du chargement des exercices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercices();
  }, []);

  // Apply user filters
  const displayedItems = Exercices.filter(item => {
    return (
      (niveauFilter === "" || item.niveau === niveauFilter) &&
      (professeurFilter === "" || item.professeur === professeurFilter)&&
      (matiereFilter=== "" || item.matiere===matiereFilter)
    );
  });

  return (
    <div className="contentPage">
      <h1 className="pageTitle">Nos Exercices</h1>

      {loading ? (
        <p className="loadingText">Chargement des exercices...</p>
      ) : (
        <>
          {/* Filters Section */}
          <div className="filtersSection">
            <select
              className="filterSelect"
              value={niveauFilter}
              onChange={(e) => setNiveauFilter(e.target.value)}
            >
              <option value="">Tous les niveaux</option>
              <option value="1ère Bac">1ère Bac</option>
              <option value="2ème Bac">2ème Bac</option>
              <option value="Tronc Commun">Tronc Commun</option>
            </select>

            <select value={matiereFilter} onChange={(e) => setMatiereFilter(e.target.value)} className="filterSelect">
              <option value="">Matiére</option>
              <option value="Physique">Physique</option>
              <option value="Chimie">Chimie</option>
            </select>


            <select
              className="filterSelect"
              value={professeurFilter}
              onChange={(e) => setProfesseurFilter(e.target.value)}
            >
              <option value="">Tous les professeurs</option>
              {Exercices
                .map(item => item.professeur)
                .filter((v, i, a) => a.indexOf(v) === i) // unique professeurs
                .map((prof, index) => (
                  <option key={index} value={prof}>{prof}</option>
                ))
              }
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
                  <p className="itemInfo"><strong>Professeur:</strong> {item.professeur}</p>
                  <p className="itemDescription">{item.description}</p>
                  {item.pdf_fichier && (
                    <a
                      href={`${BACKEND_URL}${item.pdf_fichier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="btnAction">Voir l'exercice</button>
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
