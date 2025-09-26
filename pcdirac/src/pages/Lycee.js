// Lycee.js
import FilesPage from "./FilesPage";

export default function Lycee() {
  return (
    <FilesPage
      endpoint="/api/courses/etudiant/lycee"
      title="Lycée"
      filters={[
        {key:"niveau",label:"Tronc Commun"},
        { key: "categorie", label: "Cours" },
        { key: "matiere", label: "Physique" },
        { key: "unite", label: "Toutes les unités" },
        { key: "titre", label: "Tous les titres" },
        { key: "professeur", label: "Tous les professeurs" }
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
