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
        "Concours d'entrée": "Voir le concours",
        "Concours de sortie": "Voir le concours",
        "Rapport de jury":"Voir le rapport",
        "Leçons physique":"Voir le leçon",
        "Leçons chimie":"Voir le leçon",
        "Montage physique":"Voir le montage"
      }}
    />
  );
}
