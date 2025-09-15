import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css";

const BACKEND_URL = "http://pcdirac.com:8080";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [niveauFilter, setNiveauFilter] = useState("");
  const [professeurFilter, setProfesseurFilter] = useState("");
  const [matiereFilter, setMatiereFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/courses/etudiant/activitie`
        );
        if (!response.ok) {
          throw new Error("Erreur réseau");
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Erreur lors du chargement des activités:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // ✅ Apply filters
  const displayedActivities = activities.filter((act) => {
    return (
      (niveauFilter === "" || act.niveau === niveauFilter) &&
      (professeurFilter === "" || act.professeur === professeurFilter) &&
      (matiereFilter === "" || act.matiere === matiereFilter)
    );
  });

  return (
    <div className="contentPage">
      <h1 className="pageTitle">Nos Activités</h1>

      {loading ? (
        <p className="loadingText">Chargement des activités...</p>
      ) : (
        <>
          {/* ✅ Filters Section */}
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

            <select
              value={matiereFilter}
              onChange={(e) => setMatiereFilter(e.target.value)}
              className="filterSelect"
            >
              <option value="">Matière</option>
              <option value="Physique">Physique</option>
              <option value="Chimie">Chimie</option>
            </select>

            <select
              className="filterSelect"
              value={professeurFilter}
              onChange={(e) => setProfesseurFilter(e.target.value)}
            >
              <option value="">Tous les professeurs</option>
              {activities
                .map((act) => act.professeur)
                .filter((v, i, a) => a.indexOf(v) === i) // ✅ unique professeurs
                .map((prof, index) => (
                  <option key={index} value={prof}>
                    {prof}
                  </option>
                ))}
            </select>
          </div>

          {/* ✅ Activities Grid */}
          <div className="itemsGrid">
            {displayedActivities.length > 0 ? (
              displayedActivities.map((act) => (
                <div key={act.id} className="itemCard">
                  {act.miniature && (
                    <img
                      src={`${BACKEND_URL}${act.miniature}`}
                      alt={act.titre}
                      className="itemThumbnail"
                    />
                  )}
                  <h3 className="itemTitle">{act.titre}</h3>
                  <p className="itemInfo">
                    <strong>Niveau:</strong> {act.niveau}
                  </p>
                  <p className="itemInfo">
                    <strong>Professeur:</strong> {act.professeur}
                  </p>
                  <p className="itemDescription">{act.description}</p>
                  {act.pdf_fichier && (
                    <a
                      href={`${BACKEND_URL}${act.pdf_fichier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="btnAction">Voir l'activité</button>
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="noItemsText">
                Aucune activité trouvée pour ces filtres.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Activities;
