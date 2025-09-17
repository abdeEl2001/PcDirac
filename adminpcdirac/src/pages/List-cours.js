import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/List-cours_style.css";
import { Link } from "react-router-dom";

const ListCours = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = sessionStorage.getItem("userId"); // logged-in user ID

  // Fetch courses for this user
  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) {
        setError("Utilisateur non connecté");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://api.pcdirac.com/api/courses?userId=${userId}`);
        setCourses(response.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des cours");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  // Filtered courses
  const filteredCourses =
    filter === "all"
      ? courses
      : courses.filter((course) => course.categorie.toLowerCase() === filter);

  if (loading) return <p>Chargement des cours...</p>;
  if (error) return <p>{error}</p>;
  const handleDelete = async (id) => {
  if (!window.confirm("Voulez-vous vraiment supprimer ce cours ?")) return;

  try {
    await axios.delete(`https://api.pcdirac.com/api/courses/${id}`);
    setCourses(courses.filter((course) => course.id !== id)); // remove from UI
  } catch (err) {
    console.error(err);
    setError("Erreur lors de la suppression du cours");
  }
};


  return (
    <div className="coursListContent">
      <div className="container">
        {/* Header */}
        <header>
          <h1>Liste des Fichiers</h1>
          <Link to="/addCours" className="add-course-btn">
            Ajouter un Nouveau Fichier
          </Link>
        </header>

        {/* Filter Section */}
        <div className="filter-section">
          <label htmlFor="category-filter">Filtrer par:</label>
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
          </select>
        </div>

        {/* Table */}
        <table className="course-table">
          <thead>
            <tr>
              <th>Titre du fichier</th>
              <th>Niveau</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td>{course.titre}</td>
                  <td>{course.niveau}</td>
                  <td>{course.categorie}</td>
                  <td>
                    {course.pdf_fichier ? (
                      <a
                        href={`https://api.pcdirac.com${course.pdf_fichier}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="see_pdf"
                      >
                        Voir PDF
                      </a>
                    ) : (
                      "Pas de PDF"
                    )}
                    <br />
                    <button
                      className="btn editCours"
                      onClick={() => (window.location.href = `/editCours/${course.id}`)}
                    >
                      Modifier
                    </button>

                    <button className="btn deleteCours"
                    onClick={()=>handleDelete(course.id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Aucun fichier trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListCours;
