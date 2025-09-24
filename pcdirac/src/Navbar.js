// src/components/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./pages/style/Menu_style.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="headerNavbar">
      {/* Logo */}
      <div className="logoSection">
        <h1 className="logoText">
          PcDirac<span className="orangeDot">.</span>
        </h1>
      </div>

      {/* Hamburger button (only shows on mobile) */}
      <button className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>


      {/* Menu */}
      <nav className={`menuComposition ${isOpen ? "open" : ""}`}>
        <Link to="/acceuil" className="menuItem" onClick={() => setIsOpen(false)}>
          <span>Acceuil</span>
        </Link>
        <Link to="/videos" className="menuItem" onClick={() => setIsOpen(false)}>
          <span>Videos</span>
        </Link>
        <Link to="/lycee" className="menuItem" onClick={() => setIsOpen(false)}>
          <span>Lycée</span>
        </Link>
        <Link to="/licence" className="menuItem" onClick={() => setIsOpen(false)}>
          <span>Licence</span>
        </Link>
        <Link to="/agregation" className="menuItem" onClick={() => setIsOpen(false)}>
          <span>Agrégation</span>
        </Link>
      </nav>

      {/* Social icons (desktop only, hidden under 992px) */}
      <div className="social-media navbar-icons">
        <a href="https://www.facebook.com/profile.php?id=61567798160472" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.tiktok.com/@pcdirac?_t=ZS-8zmTJm3O75G&_r=1" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
          <i className="fab fa-tiktok"></i>
        </a>
        <a href="https://www.instagram.com/pcdirac/?igsh=djhjd3FueDZvc29l" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://www.youtube.com/@PCDirac/featured" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
          <i className="fab fa-youtube"></i>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
