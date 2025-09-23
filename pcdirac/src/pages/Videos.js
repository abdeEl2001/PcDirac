import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css";
import Footer from "../Footer";

const BACKEND_URL = "https://api.pcdirac.com";

const normalize = (s) => (s ? String(s).trim().toLowerCase() : "");
const uniqueSorted = (arr) =>
  Array.from(new Set(arr.filter(Boolean).map((s) => (typeof s === "string" ? s.trim() : s))))
    .sort((a, b) => a.localeCompare(b));

// pick a default value (case-insensitive) from options, otherwise fallback
const pickDefault = (desired, options = [], fallback = "") => {
  if (!options || options.length === 0) return fallback || "";
  if (!desired) return options[0];
  const found = options.find((o) => normalize(o) === normalize(desired));
  return found ?? options[0];
};

const Videos = () => {
  const [etape, setEtape] = useState(""); // Lycée, Licence, Agrégation
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Filters
  const [niveauFilter, setNiveauFilter] = useState("");
  const [categorieFilter, setCategorieFilter] = useState("");
  const [matiereFilter, setMatiereFilter] = useState("");
  const [uniteFilter, setUniteFilter] = useState("");
  const [titreFilter, setTitreFilter] = useState("");

  // Fetch videos when `etape` changes
  useEffect(() => {
    if (!etape) {
      setVideos([]);
      // clear filters when no etape
      setNiveauFilter("");
      setCategorieFilter("");
      setMatiereFilter("");
      setUniteFilter("");
      setTitreFilter("");
      return;
    }

    const fetchVideos = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const params = new URLSearchParams();
        params.append("etape", etape);
        const res = await fetch(`${BACKEND_URL}/api/videos/all?${params.toString()}`);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Erreur réseau (${res.status}) ${txt}`);
        }
        const data = await res.json();
        const videosArray = Array.isArray(data) ? data : [];

        setVideos(videosArray);

        // build raw options from backend
        const niveauxRaw = uniqueSorted(videosArray.map((v) => v.niveau).filter(Boolean));
        const categoriesRaw = uniqueSorted(videosArray.map((v) => v.categorie).filter(Boolean));
        const matieresRaw = uniqueSorted(videosArray.map((v) => v.matiere).filter(Boolean));

        // Determine defaults per étape, but only if backend provides those values.
        // Also remove "Examens Nationaux" from category choices if niveau !== "2éme Année Bac"
        let chosenNiveau = "";
        let chosenCategorie = "";
        let chosenMatiere = "";

        if (etape === "Lycée") {
          // prefer "Tronc Commun" niveau, else first backend niveau (if any)
          chosenNiveau = pickDefault("Tronc Commun", niveauxRaw, "");
          // categories available for that niveau
          const catsForNiveau = uniqueSorted(
            videosArray
              .filter((v) => !chosenNiveau || normalize(v.niveau) === normalize(chosenNiveau))
              .map((v) => v.categorie)
              .filter(Boolean)
          );
          // remove Examens Nationaux unless chosenNiveau equals "2éme Année Bac"
          const catsFiltered = chosenNiveau && normalize(chosenNiveau) !== normalize("2éme Année Bac")
            ? catsForNiveau.filter((c) => normalize(c) !== normalize("Examens Nationaux"))
            : catsForNiveau;
          chosenCategorie = pickDefault("Cours", catsFiltered, catsFiltered[0] ?? "");
          // matieres available for niveau+categorie
          const matForNC = uniqueSorted(
            videosArray
              .filter((v) =>
                (!chosenNiveau || normalize(v.niveau) === normalize(chosenNiveau)) &&
                (!chosenCategorie || normalize(v.categorie) === normalize(chosenCategorie))
              )
              .map((v) => v.matiere)
              .filter(Boolean)
          );
          chosenMatiere = pickDefault("Physique", matForNC, matForNC[0] ?? "");
        } else if (etape === "Licence") {
          chosenNiveau = ""; // none
          // categories excluding "Examens Nationaux" because not lycée 2ème bac
          const catsFiltered = categoriesRaw.filter((c) => normalize(c) !== normalize("Examens Nationaux"));
          chosenCategorie = pickDefault("Cours Licence", catsFiltered, catsFiltered[0] ?? "");
          const matForC = uniqueSorted(
            videosArray
              .filter((v) => !chosenCategorie || normalize(v.categorie) === normalize(chosenCategorie))
              .map((v) => v.matiere)
              .filter(Boolean)
          );
          chosenMatiere = pickDefault("Physique", matForC, matForC[0] ?? "");
        } else if (etape === "Agrégation") {
          chosenNiveau = "";
          const catsFiltered = categoriesRaw.filter((c) => normalize(c) !== normalize("Examens Nationaux"));
          chosenCategorie = pickDefault("Concours d'entrée", catsFiltered, catsFiltered[0] ?? "");
          const matForC = uniqueSorted(
            videosArray
              .filter((v) => !chosenCategorie || normalize(v.categorie) === normalize(chosenCategorie))
              .map((v) => v.matiere)
              .filter(Boolean)
          );
          chosenMatiere = pickDefault("Physique", matForC, matForC[0] ?? "");
        } else {
          // fallback: use firsts
          chosenNiveau = niveauxRaw[0] ?? "";
          chosenCategorie = categoriesRaw[0] ?? "";
          chosenMatiere = matieresRaw[0] ?? "";
        }

        // apply chosen defaults
        setNiveauFilter(chosenNiveau);
        setCategorieFilter(chosenCategorie);
        setMatiereFilter(chosenMatiere);
        setUniteFilter("");
        setTitreFilter("");
      } catch (err) {
        console.error("fetchVideos error:", err);
        setErrorMsg(err.message || "Erreur réseau");
        setVideos([]);
        // clear filters on error
        setNiveauFilter("");
        setCategorieFilter("");
        setMatiereFilter("");
        setUniteFilter("");
        setTitreFilter("");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [etape]);

  // Derived option lists (respect current filters)
  const niveauOptions = uniqueSorted(videos.map((v) => v.niveau).filter(Boolean));

  // categories -> if niveauFilter !== "2éme Année Bac" remove Examens Nationaux from choices
  const rawCategorieOptions = uniqueSorted(videos.map((v) => v.categorie).filter(Boolean));
  const categorieOptions = (normalize(niveauFilter) !== normalize("2éme Année Bac"))
    ? rawCategorieOptions.filter((c) => normalize(c) !== normalize("Examens Nationaux"))
    : rawCategorieOptions;

  const matieresOptions = uniqueSorted(
    videos
      .filter((v) => {
        if (niveauFilter && normalize(v.niveau) !== normalize(niveauFilter)) return false;
        if (categorieFilter && normalize(v.categorie) !== normalize(categorieFilter)) return false;
        return true;
      })
      .map((v) => v.matiere)
      .filter(Boolean)
  );

  const unitesOptions = uniqueSorted(
    videos
      .filter((v) => {
        if (niveauFilter && normalize(v.niveau) !== normalize(niveauFilter)) return false;
        if (categorieFilter && normalize(v.categorie) !== normalize(categorieFilter)) return false;
        if (matiereFilter && normalize(v.matiere) !== normalize(matiereFilter)) return false;
        return true;
      })
      .map((v) => v.unite)
      .filter(Boolean)
  );

  const titresOptions = uniqueSorted(
    videos
      .filter((v) => {
        if (niveauFilter && normalize(v.niveau) !== normalize(niveauFilter)) return false;
        if (categorieFilter && normalize(v.categorie) !== normalize(categorieFilter)) return false;
        if (matiereFilter && normalize(v.matiere) !== normalize(matiereFilter)) return false;
        if (uniteFilter && normalize(v.unite) !== normalize(uniteFilter)) return false;
        return true;
      })
      .map((v) => v.titre)
      .filter(Boolean)
  );

  // Final displayed items: apply selected filters
  const displayedItems = videos.filter((v) => {
    if (niveauFilter && normalize(v.niveau) !== normalize(niveauFilter)) return false;
    if (categorieFilter && normalize(v.categorie) !== normalize(categorieFilter)) return false;
    if (matiereFilter && normalize(v.matiere) !== normalize(matiereFilter)) return false;
    if (uniteFilter && normalize(v.unite) !== normalize(uniteFilter)) return false;
    if (titreFilter && normalize(v.titre) !== normalize(titreFilter)) return false;
    return true;
  });

  // Handlers that also reset dependent filters
  const handleEtapeChange = (val) => {
    setEtape(val);
  };
  const handleNiveauChange = (val) => {
    setNiveauFilter(val);
    // changing niveau may change available categories/matieres
    setCategorieFilter("");
    setMatiereFilter("");
    setUniteFilter("");
    setTitreFilter("");
  };
  const handleCategorieChange = (val) => {
    setCategorieFilter(val);
    setMatiereFilter("");
    setUniteFilter("");
    setTitreFilter("");
  };
  const handleMatiereChange = (val) => {
    setMatiereFilter(val);
    setUniteFilter("");
    setTitreFilter("");
  };
  const handleUniteChange = (val) => {
    setUniteFilter(val);
    setTitreFilter("");
  };

  
  

  return (
    <div className="pageContainer">
    <div className="contentPage">
      <h1 className="pageTitle">Vidéos</h1>

      {/* Étape selector */}
      <div className="filtersSection">
        <select value={etape} onChange={(e) => handleEtapeChange(e.target.value)} className="filterSelect">
          <option value="">Sélectionnez l'étape</option>
          <option value="Lycée">Lycée</option>
          <option value="Licence">Licence</option>
          <option value="Agrégation">Agrégation</option>
        </select>
      </div>

      {loading ? (
        <p className="loadingText">Chargement des vidéos...</p>
      ) : (
        <>
          {errorMsg && <p className="loadingText" style={{ color: "red" }}>{errorMsg}</p>}

          {etape && (
            <div className="filtersSection">
              {etape === "Lycée" && (
                <>
                  <select value={niveauFilter} onChange={(e) => handleNiveauChange(e.target.value)} className="filterSelect">
                    <option value="">Tous les niveaux</option>
                    {niveauOptions.map((n, idx) => (<option key={idx} value={n}>{n}</option>))}
                  </select>

                  <select value={categorieFilter} onChange={(e) => handleCategorieChange(e.target.value)} className="filterSelect">
                    <option value="">Toutes les catégories</option>
                    {categorieOptions.map((c, idx) => (<option key={idx} value={c}>{c}</option>))}
                  </select>

                  <select value={matiereFilter} onChange={(e) => handleMatiereChange(e.target.value)} className="filterSelect">
                    <option value="">Matière</option>
                    {matieresOptions.map((m, idx) => (<option key={idx} value={m}>{m}</option>))}
                  </select>

                  <select value={uniteFilter} onChange={(e) => handleUniteChange(e.target.value)} className="filterSelect">
                    <option value="">Unité</option>
                    {unitesOptions.map((u, idx) => (<option key={idx} value={u}>{u}</option>))}
                  </select>

                  <select value={titreFilter} onChange={(e) => setTitreFilter(e.target.value)} className="filterSelect">
                    <option value="">Titre</option>
                    {titresOptions.map((t, idx) => (<option key={idx} value={t}>{t}</option>))}
                  </select>
                </>
              )}

              {etape === "Licence" && (
                <>
                  <select value={categorieFilter} onChange={(e) => handleCategorieChange(e.target.value)} className="filterSelect">
                    <option value="">Toutes les catégories</option>
                    {categorieOptions.map((c, idx) => (<option key={idx} value={c}>{c}</option>))}
                  </select>

                  <select value={matiereFilter} onChange={(e) => handleMatiereChange(e.target.value)} className="filterSelect">
                    <option value="">Matière</option>
                    {matieresOptions.map((m, idx) => (<option key={idx} value={m}>{m}</option>))}
                  </select>

                  <select value={uniteFilter} onChange={(e) => handleUniteChange(e.target.value)} className="filterSelect">
                    <option value="">Unité</option>
                    {unitesOptions.map((u, idx) => (<option key={idx} value={u}>{u}</option>))}
                  </select>

                  <select value={titreFilter} onChange={(e) => setTitreFilter(e.target.value)} className="filterSelect">
                    <option value="">Titre</option>
                    {titresOptions.map((t, idx) => (<option key={idx} value={t}>{t}</option>))}
                  </select>
                </>
              )}

              {etape === "Agrégation" && (
                <>
                  <select value={categorieFilter} onChange={(e) => handleCategorieChange(e.target.value)} className="filterSelect">
                    <option value="">Toutes les catégories</option>
                    {categorieOptions.map((c, idx) => (<option key={idx} value={c}>{c}</option>))}
                  </select>

                  <select value={matiereFilter} onChange={(e) => handleMatiereChange(e.target.value)} className="filterSelect">
                    <option value="">Matière</option>
                    {matieresOptions.map((m, idx) => (<option key={idx} value={m}>{m}</option>))}
                  </select>

                  <select value={titreFilter} onChange={(e) => setTitreFilter(e.target.value)} className="filterSelect">
                    <option value="">Titre</option>
                    {titresOptions.map((t, idx) => (<option key={idx} value={t}>{t}</option>))}
                  </select>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Videos Grid */}
      <div className="itemsGrid">
        {displayedItems.length > 0 ? (
          displayedItems.map((v) => (
            <div key={v.id} className="itemCard">
              {v.miniature && <img src={`${BACKEND_URL}${v.miniature}`} alt={v.titre}  className="itemThumbnail" />}
              <h3 className="itemTitle">{v.titre}</h3>
              <p className="itemInfo"><strong>Catégorie:</strong> {v.categorie}</p>
              {v.niveau && <p className="itemInfo"><strong>Niveau:</strong> {v.niveau}</p>}
              {/* hide matiere when category is Examens Nationaux */}
              {normalize(v.categorie) !== normalize("Examens Nationaux") && v.matiere && (
                <p className="itemInfo"><strong>Matière:</strong> {v.matiere}</p>
              )}
              {v.unite && <p className="itemInfo"><strong>Unité:</strong> {v.unite}</p>}
              <p className="itemDescription">{v.description}</p>
              {v.lien && (
                <a href={v.lien} target="_blank" rel="noopener noreferrer">
                  <button className="btnAction">Voir la video</button>
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="noItemsText">Aucune vidéo trouvée pour ces filtres.</p>
        )}
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Videos;
