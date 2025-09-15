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
      <button className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Menu */}
      <nav className={`menuComposition ${isOpen ? "open" : ""}`}>
        <Link to="/acceuil" className="menuItem" onClick={() => setIsOpen(false)}>
          <span>Acceuil</span>
        </Link>
        <Link to="/cours" className="menuItem" onClick={() => setIsOpen(false)}>
          <span>Cours</span>
        </Link>
        <Link to="/exercices" className="menuItem" onClick={() => setIsOpen(false)}>
          <span>Exercices</span>
        </Link>
        <Link to="/activities" className="menuItem" onClick={() => setIsOpen(false)}>
          <span>Activities</span>
        </Link>
      </nav>

      {/* Social icons */}
      <div className="social-media">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://www.youtube.com/@PCDirac/playlists" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
          <i className="fab fa-youtube"></i>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
