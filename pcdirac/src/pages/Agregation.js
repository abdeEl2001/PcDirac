// Agregation.js
import FilesPage from "./FilesPage";

export default function Agregation() {
  return (
    <FilesPage
      endpoint="/api/courses/etudiant/agregation"
      title="Agrégation"
      filters={[
        { key: "categorie", label: "Tous les catégories", defaultValue: "Concours d'entrée" },
        { key: "matiere", label: "Toutes les matières", defaultValue:"Physique" },
        { key: "titre", label: "Tous les titres", defaultValue: "" },
        { key: "professeur", label: "Tous les professeurs" },
      ]}
      buttonLabels={{
        "Cours": "Voir le cours",
        "Exercices": "Voir l'exercice"
      }}
    />
  );
}
