import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./HeaderAdmin.css";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const [headerData, setHeaderData] = useState({
    prenom: "",
    nom: "",
    photoprofile: ""
  });
  const [menuActive, setMenuActive] = useState(false);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await axios.get(`https://api.pcdirac.com/api/users/header/${userId}`);
        setHeaderData(response.data);
      } catch (err) {
        console.error("Erreur chargement header :", err);
      }
    };
    if (userId) fetchHeaderData();
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <header className="headerAdmin">
      {/* Logo left */}
      <div className="logoHeader">
        <img src="/images/output-onlinepngtools(1).png" alt="Logo" />
      </div>

      {/* Hamburger for mobile */}
      <button className="hamburger" onClick={() => setMenuActive(!menuActive)}>
        &#9776;
      </button>

      {/* Right: Profile / Menu */}
      <div className={`headerRight ${menuActive ? "active" : ""}`}>
        <div className="profilDesktop">
          {/* Profile photo desktop only */}
          <div className="photoProfilHeader">
            <img
              src={`https://api.pcdirac.com/uploads/profiles/${headerData.photoprofile}`}
              alt="Profil"
            />
          </div>
          <div className="nameProfil">
            <h4>{headerData.prenom} {headerData.nom}</h4>
          </div>
          <div className="logout">
            <button onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="mobileMenu">
          <Link to="/dashboard" onClick={() => setMenuActive(false)}>Dashboard</Link>
          <Link to="/list-cours" onClick={() => setMenuActive(false)}>Liste des Fichiers</Link>
          <Link to="/profil" onClick={() => setMenuActive(false)}>Profil</Link>
          <button className="logoutMobile" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
