import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HeaderAdmin.css"; // if you want to style it

const HeaderAdmin = ({ profilePicture, name }) => {
  const navigate = useNavigate();
  
const [headerData, setHeaderData] = useState({
    prenom: "",
    nom: "",
    photoprofile: ""
  });

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/header/${userId}`);
        setHeaderData(response.data);
      } catch (err) {
        console.error("Erreur chargement header :", err);
      }
    };

    if (userId) fetchHeaderData();
  }, [userId]);

  const handleLogout = () => {
    // 1. Remove token (or any user data)
    sessionStorage.removeItem("userId");

    // 2. Redirect to login page
    navigate("/login");
  };
  return (
    <div className="headerAdmin">
      <div className="profil">
        {/* Profile Photo */}
        <div className="photoProfilHeader">
          <img src={`http://localhost:8080/uploads/profiles/${headerData.photoprofile}`} alt="Profil" />
        </div>

        {/* User Name */}
        <div className="nameProfil">
          <h4>{headerData.prenom} {headerData.nom}</h4>
        </div>

        {/* Logout Button */}
        <div className="logout">
          
          <button onClick={handleLogout} >
            <a href="logout.php">Déconnexion</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
