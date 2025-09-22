import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/List-videos_style.css";
import { Link } from "react-router-dom";

const ListVideo = () => {
  const [videos, setVideos] = useState([]);
  const [filter, setFilter] = useState("all"); // cours/exercices/activités
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = sessionStorage.getItem("userId"); // logged-in user ID

  // Fetch videos for this user
  useEffect(() => {
    const fetchVideos = async () => {
      if (!userId) {
        setError("Utilisateur non connecté");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://api.pcdirac.com/api/videos?userId=${userId}`);
        setVideos(response.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des vidéos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [userId]);

  // Appliquer les filtres (catégorie + unité)
  const filteredVideos = videos.filter((course) => {
  const cat = course.categorie?.toLowerCase().trim();
  const filt = filter.toLowerCase().trim();
  return filt === "all" || cat === filt;
});


  if (loading) return <p>Chargement des vidéos...</p>;
  if (error) return <p>{error}</p>;

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette vidéo ?")) return;

    try {
      await axios.delete(`https://api.pcdirac.com/api/videos/${id}`);
      setVideos(videos.filter((video) => video.id !== id)); // remove from UI
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de la vidéo");
    }
  };

  return (
    <div className="videoListContent">
      <div className="container">
        {/* Header */}
        <header>
          <h1>Liste des vidéos</h1>
          <Link to="/addVideo" className="add-video-btn">
            Ajouter une Nouvelle Vidéo
          </Link>
        </header>

        {/* Filters Section */}
        <div className="filter-section">
          <label htmlFor="category-filter">Filtrer par catégorie :</label>
          <select
            id="category-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tous</option>
            <option value="cours">Cours</option>
            <option value="exercices">Exercices</option>
            <option value="activities">Activités</option>
            <option value="Devoirs surveillés">Devoirs surveillés</option>
            <option value="Documents pédagogiques">Documents pédagogiques</option>
            <option value="Examens Nationaux">Examens Nationaux</option>
            <option value="Cours Licence">Cours Licence</option>
            <option value="Travaux dirigés">Travaux dirigés</option>
            <option value="Concours d'entrée">Concours d'entrée</option>
            <option value="Concours de sortie">Concours de sortie</option>
            <option value="Rapport de jury">Rapport de jury</option>
            <option value="Leçons physique">Leçons physique</option>
            <option value="Leçons Chimie">Leçons Chimie</option>
            <option value="Montage physique">Montage physique</option>
          </select>
        </div>

        {/* Table */}
        <table className="video-table">
          <thead>
            <tr>
              <th>Titre de la vidéo</th>
              <th>Niveau</th>
              <th>Unité</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <tr key={video.id}>
                  <td>{video.titre}</td>
                  <td>{video.niveau || "—"}</td>
                  <td>{video.unite || "—"}</td>
                  <td>{video.categorie}</td>
                  <td>
                    {video.lien ? (
                      <a
                        href={video.lien}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="see_video"
                      >
                        Voir Vidéo
                      </a>
                    ) : (
                      "Pas de vidéo"
                    )}
                    <br />
                    <button
                      className="btn editVideo"
                      onClick={() => (window.location.href = `/editVideo/${video.id}`)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn deleteVideo"
                      onClick={() => handleDelete(video.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Aucune vidéo trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListVideo;
