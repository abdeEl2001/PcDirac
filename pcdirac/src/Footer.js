// src/components/Footer.js
import React from "react";
import "./pages/style/Menu_style.css";

const Footer = () => {
  return (
    <footer className="footerSection">
      {/* Social icons (visible only under 992px) */}
      <div className="social-media footer-icons">
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
      <p className="footerText">© {new Date().getFullYear()} PcDirac. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
