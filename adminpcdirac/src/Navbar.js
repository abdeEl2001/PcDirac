import React from "react";
import { Link } from "react-router-dom";
import './MenuStyle.css';

const Navbar = () => {
  return (
    <div className="sideMenuSection">
      {/* Logo Section */}
      <div className="logoSection">
        <img src="/images/output-onlinepngtools(1).png" alt="Logo" />
      </div>

      {/* Menu Section */}
      <div className="menuComposition">
        {/* Dashboard */}
        <div className="dashboardSection">
          <div className="dashboardTitle">
            <Link to="/dashboard">
              <img
                src="/images/lanalyse-des-donnees.png"
                alt="Dashboard"
                className="iconsMenu"
              />
              Tableau de bord
            </Link>
          </div>
        </div>

        {/* Files */}
        <div className="coursSection">
          <div className="coursTitle">
            <Link to="/list-cours">
              <img
                src="/images/document.png"
                alt="Fichiers"
                className="iconsMenu"
              />
              Liste des Fichiers
            </Link>
          </div>
        </div>

        {/* Videos */}
        <div className="videoSection">
          <div className="videoTitle">
            <Link to="/list-video">
              <img
                src="/images/youtube.png"
                alt="Fichiers"
                className="iconsMenu"
              />
              Liste des Videos
            </Link>
          </div>
        </div>


        {/* Profile */}
        <div className="profilSection">
          <div className="profilTitle">
            <Link to="/profil">
              <img
                src="/images/des-profils-dutilisateurs.png"
                alt="Profil"
                className="iconsMenu"
              />
              Profil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
