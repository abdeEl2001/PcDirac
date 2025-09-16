import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/Dashboard_style.css";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!userId) return;

        const response = await axios.get(
          `https://api.pcdirac.com/api/courses?userId=${userId}`
        );
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des cours");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p>{error}</p>;

  // Count by category
  const totalCours = courses.filter(c => c.categorie.toLowerCase() === "cours").length;
  const totalExercices = courses.filter(c => c.categorie.toLowerCase() === "exercices").length;
  const totalActivites = courses.filter(c => c.categorie.toLowerCase() === "activités").length;

  // Latest 5 courses
  const latestCourses = courses.slice(-5).reverse();

  return (
    <div>
      {/* Stat Cards */}
      <section className="stats-cards">
        <div className="card">
          <h3>Total des Cours</h3>
          <p>{totalCours}</p>
        </div>
        <div className="card">
          <h3>Activités Récentes</h3>
          <p>{totalActivites} </p>
        </div>
        <div className="card">
          <h3>Exercices</h3>
          <p>{totalExercices} </p>
        </div>
      </section>

      {/* Tableau de Données */}
      <section className="data-table">
        <h2>Derniers Cours Ajoutés</h2>
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Niveau</th>
              <th>Catégorie</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {latestCourses.map(course => (
              <tr key={course.id}>
                <td>{course.titre}</td>
                <td>{course.niveau}</td>
                <td>{course.categorie}</td>
                <td>{new Date(course.cree_le.split('.')[0].replace(' ', 'T')).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
