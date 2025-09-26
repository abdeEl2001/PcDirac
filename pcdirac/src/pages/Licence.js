// Licence.js
import { defaultValueTypes } from "framer-motion";
import FilesPage from "./FilesPage";

export default function Licence() {
  return (
    <FilesPage
      endpoint="/api/courses/etudiant/license"
      title="Licence"
      filters={[
        { key: "categorie", label: "Toutes les catégories",defaultValue:"Cours Licence" },
        { key: "matiere", label: "Toutes les matières" ,defaultValue:"Physique"},
        { key: "unite", label: "Toutes les unités", defaultValue: "" },
        { key: "titre", label: "Tous les titres", defaultValue: "" }
      ]}
      buttonLabels={{
        "Cours Licence": "Voir le cours",
        "Travaux dirigés": "Voir le TD"
      }}
    />
  );
}
