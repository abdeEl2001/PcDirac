
import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css"; // generic reusable CSS

const BACKEND_URL = "https://api.pcdirac.com";
const DocumentsPedagogiques = () => {
    const [DocumentsPedagogiques, setDocumentsPedagogiques] = useState([]); // generic name for courses/exercices
        const [niveauFilter, setNiveauFilter] = useState("");
        const [professeurFilter, setProfesseurFilter] = useState("");
        const [matiereFilter,setMatiereFilter]=useState("");
        const [loading, setLoading] = useState(true);
        
          // Fetch courses from API
          useEffect(() => {
            const fetchDocumentsPedagogiques = async () => {
              try {
                const response = await fetch(`${BACKEND_URL}/api/courses/etudiant/documentsPedagogiques`);
                if (!response.ok) {
                  throw new Error("Erreur réseau");
                }
                const data = await response.json();
                setDocumentsPedagogiques(data);
              } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
              } finally {
                setLoading(false);
              }
            };
        
            fetchDocumentsPedagogiques();
          }, []);
        
          // Apply user filters
          const displayedItems = DocumentsPedagogiques.filter(item => {
            return (
              (niveauFilter === "" || item.niveau === niveauFilter) &&
              (professeurFilter === "" || item.professeur === professeurFilter)&&
              (matiereFilter=== "" || item.matiere===matiereFilter)
            );
          });
        
          return (
            <div className="contentPage">
              <h1 className="pageTitle">Nos Documents pédagogiques</h1>
        
              {loading ? (
                <p className="loadingText">Chargement des Documents pédagogiques...</p>
              ) : (
                <>
                  {/* Filters Section */}
                  <div className="filtersSection">
                    <select value={niveauFilter} onChange={(e) => setNiveauFilter(e.target.value)} className="filterSelect">
                      <option value="">Tous les niveaux</option>
                      <option value="1ère Année Bac">1ère Année Bac</option>
                      <option value="2ème Année Bac">2ème Année Bac</option>
                      <option value="Tronc Commun">Tronc Commun</option>
                    </select>
                    <select value={matiereFilter} onChange={(e) => setMatiereFilter(e.target.value)} className="filterSelect">
                      <option value="">Matiére</option>
                      <option value="Physique">Physique</option>
                      <option value="Chimie">Chimie</option>
                    </select>
        
                    <select value={professeurFilter} onChange={(e) => setProfesseurFilter(e.target.value)} className="filterSelect">
                      <option value="">Tous les professeurs</option>
                      {DocumentsPedagogiques
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
                            >
                              <button className="btnAction">Voir le Document pédagogique</button>
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="noItemsText">Aucun Document pédagogique trouvé pour ces filtres.</p>
                    )}
                  </div>
                </>
              )}
            </div>
            )
}
 
export default DocumentsPedagogiques;