import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css"; // generic reusable CSS

const BACKEND_URL = "https://api.pcdirac.com";

const DevoirSurveille = () => {
  const [devoirsSurveilles, setDevoirsSurveilles] = useState([]); // generic name for courses/exercices
  const [niveauFilter, setNiveauFilter] = useState("");
  const [professeurFilter, setProfesseurFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch courses from API
  useEffect(() => {
    const fetchDevoirSurveille = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/courses/etudiant/devoirSurveille`);
        if (!response.ok) {
          throw new Error("Erreur réseau");
        }
        const data = await response.json();
        setDevoirsSurveilles(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevoirSurveille();
  }, []);

  // Apply user filters (without matiereFilter)
  const displayedItems = devoirsSurveilles.filter(item => {
    return (
      (niveauFilter === "" || item.niveau === niveauFilter) &&
      (professeurFilter === "" || item.professeur === professeurFilter)
    );
  });

  return (
    <div className="contentPage">
      <h1 className="pageTitle">Nos Devoirs surveillés</h1>

      {loading ? (
        <p className="loadingText">Chargement des Devoirs surveillés...</p>
      ) : (
        <>
          {/* Filters Section */}
          <div className="filtersSection">
            <select
              value={niveauFilter}
              onChange={(e) => setNiveauFilter(e.target.value)}
              className="filterSelect"
            >
              <option value="">Tous les niveaux</option>
              <option value="1ère Année Bac">1ère Année Bac</option>
              <option value="2ème Année Bac">2ème Année Bac</option>
              <option value="Tronc Commun">Tronc Commun</option>
            </select>

            <select
              value={professeurFilter}
              onChange={(e) => setProfesseurFilter(e.target.value)}
              className="filterSelect"
            >
              <option value="">Tous les professeurs</option>
              {devoirsSurveilles
                .map(item => item.professeur)
                .filter((v, i, a) => a.indexOf(v) === i) // unique professors
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
                      className="linkAction"
                    >
                      <button className="btnAction">Voir le Devoir surveillé</button>
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="noItemsText">Aucun Devoir surveillé trouvé pour ces filtres.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DevoirSurveille;
