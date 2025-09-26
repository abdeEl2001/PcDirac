// Lycee.js
import FilesPage from "./FilesPage";

export default function Lycee() {
  return (
    <FilesPage
      endpoint="/api/courses/etudiant/lycee"
      title="Lycée"
      filters={[
        { key: "niveau", label: "Tous les niveaux", defaultValue: "Tronc Commun" },
        { key: "categorie", label: "Tous les catégories", defaultValue: "Cours" },
        { key: "matiere", label: "Tous les matiéres", defaultValue: "Physique" },
        { key: "unite", label: "Toutes les unités", defaultValue: "" },
        { key: "titre", label: "Tous les titres", defaultValue: "" },
        { key: "professeur", label: "Tous les professeurs", defaultValue: "" }
      ]}
      buttonLabels={{
        "Cours": "Voir le cours",
        "Exercices": "Voir l'exercice",
        "Activités": "Voir l'activité",
        "Devoirs surveillés": "Voir le devoir",
        "Examens Nationaux": "Voir l'examen"
      }}
    />
  );
}
