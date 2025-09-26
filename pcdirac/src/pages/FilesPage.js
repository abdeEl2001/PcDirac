// src/components/CoursesPage.js
import React, { useState, useEffect } from "react";
import "./style/Fichier_style.css";
import Footer from "../Footer";

const BACKEND_URL = "https://api.pcdirac.com";

// helpers
const normalize = (s) => (s ? String(s).trim().toLowerCase() : "");
const uniqueSorted = (arr) =>
  Array.from(
    new Set(
      arr.filter(Boolean).map((s) => (typeof s === "string" ? s.trim() : ""))
    )
  ).sort((a, b) => a.localeCompare(b));

const sortItems = (items) => {
  return [...items].sort((a, b) => {
    if (a.ordre != null && b.ordre != null) return a.ordre - b.ordre;
    if (a.ordre != null) return -1;
    if (b.ordre != null) return 1;
    return (a.titre || "").localeCompare(b.titre || "");
  });
};

const FilesPage = ({ endpoint, title, filters, buttonLabels }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
useEffect(() => {
  const initialFilters = {};
  filters.forEach(({ key }) => (initialFilters[key] = ""));
  setActiveFilters(initialFilters);
}, [filters]);
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}${endpoint}`);
        const result = await response.json();
        setData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  // handle filter changes
  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  // build options dynamically per filter
  const getOptions = (key) => {
  return uniqueSorted(
    data
      .filter((item) => {
        return filters.every(({ key: fKey }) => {
          if (fKey === key) return true; // skip current filter
          const value = activeFilters[fKey] || "";
          return value === "" || normalize(item[fKey]) === normalize(value);
        });
      })
      .map((item) => item[key])
  );
    };


  // filter displayed items
  const displayedItems = sortItems(
    data.filter((item) =>
      Object.entries(activeFilters).every(
        ([key, value]) =>
          value === "" || normalize(item[key]) === normalize(value)
      )
    )
  );

  const getButtonLabel = (categorie) =>
    buttonLabels[categorie] || "Voir le fichier";

  return (
    <div className="pageContainer">
      <div className="contentPage">
        <h1 className="pageTitle">{title}</h1>
        {loading ? (
          <p className="loadingText">Chargement des fichiers...</p>
        ) : (
          <>
            {/* Filters */}
            <div className="filtersSection">
              {filters.map(({ key, label }) => (
                <select
                  key={key}
                  value={activeFilters[key] || ""}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="filterSelect"
                >
                  <option value="">{label}</option>
                  {getOptions(key).map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ))}
            </div>

            {/* Items */}
            <div className="itemsGrid">
              {displayedItems.length > 0 ? (
                displayedItems.map((item) => (
                  <div key={item.id} className="itemCard">
                    {item.miniature && (
                      <img
                        src={`${BACKEND_URL}${item.miniature}`}
                        alt={item.titre}
                        className="itemThumbnail"
                      />
                    )}
                    <h3 className="itemTitle">{item.titre}</h3>
                    <p className="itemInfo">
                      <strong>Catégorie:</strong> {item.categorie}
                    </p>
                    <p className="itemInfo">
                      <strong>Matière:</strong> {item.matiere}
                    </p>
                    <p className="itemInfo">
                      <strong>Unité:</strong> {item.unite}
                    </p>
                    <p className="itemInfo">
                      <strong>Professeur:</strong> {item.professeur}
                    </p>
                    <p className="itemDescription">{item.description}</p>
                    {item.pdf_fichier && (
                      <a
                        href={`${BACKEND_URL}${item.pdf_fichier}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="btnAction">
                          {getButtonLabel(item.categorie)}
                        </button>
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="noItemsText">
                  Aucun fichier trouvé pour ces filtres.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FilesPage;
