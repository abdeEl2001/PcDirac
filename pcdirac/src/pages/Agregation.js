// Agregation.js
import FilesPage from "./FilesPage";

export default function Agregation() {
  return (
    <FilesPage
      endpoint="/api/courses/etudiant/agregation"
      title="Agrégation"
      filters={[
        { key: "matiere", label: "Toutes les matières" },
        { key: "professeur", label: "Tous les professeurs" }
      ]}
      buttonLabels={{
        "Cours": "Voir le cours",
        "Exercices": "Voir l'exercice"
      }}
    />
  );
}
