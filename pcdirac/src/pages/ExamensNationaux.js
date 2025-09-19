import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css";

const BACKEND_URL = "https://api.pcdirac.com";

const ExamensNationaux = () => {
  const [examensNationaux, setExamensNationaux] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch exams from API
  useEffect(() => {
    const fetchExamensNationaux = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/courses/etudiant/examensNationaux`);
        if (!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        setExamensNationaux(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamensNationaux();
  }, []);

  return (
    <div className="contentPage">
      <h1 className="pageTitle">Examens Nationaux</h1>

      {loading ? (
        <p className="loadingText">Chargement des Examens Nationaux...</p>
      ) : (
        <div className="itemsGrid">
          {examensNationaux.length > 0 ? (
            examensNationaux.map((item) => (
              <div key={item.id} className="itemCard">
                {item.miniature && (
                  <img
                    src={`${BACKEND_URL}${item.miniature}`}
                    alt={item.titre}
                    className="itemThumbnail"
                  />
                )}
                <h3 className="itemTitle">{item.titre}</h3>
                <p className="itemDescription">{item.description}</p>
                {item.pdf_fichier && (
                  <a
                    href={`${BACKEND_URL}${item.pdf_fichier}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="btnAction">Voir l'examen National</button>
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="noItemsText">Aucun Examen National trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamensNationaux;
