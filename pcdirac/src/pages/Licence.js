// Licence.js
import FilesPage from "./FilesPage";

export default function Licence() {
  return (
    <FilesPage
      endpoint="/api/courses/etudiant/license"
      title="Licence"
      filters={[
        { key: "categorie", label: "Toutes les catégories" },
        { key: "matiere", label: "Toutes les matières" }
      ]}
      buttonLabels={{
        "Cours Licence": "Voir le cours",
        "Travaux dirigés": "Voir le TD"
      }}
    />
  );
}
