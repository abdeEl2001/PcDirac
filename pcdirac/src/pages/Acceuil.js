import React from "react";
import { motion } from "framer-motion";
import "./style/Acceuil_style.css";
import { Link } from "react-router-dom";
import Footer from "../Footer";

export default function Accueil() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="accueilPage">
      {/* Hero Section */}
      <section className="hero">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="heroTitle"
        >
          PcDirac <span className="highlight">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="heroText"
        >
          Une plateforme innovante dédiée à l’apprentissage de la{" "}
          <strong>Physique</strong> et de la <strong>Chimie</strong>, du lycée
          jusqu’à l’agrégation, proposant des cours clairs, des exercices
          pratiques et des activités interactives.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="heroButtons"
        >
          <Link to="/lycee" className="btn btnOrange">
            Découvrir les cours
          </Link>

          {/* ✅ Nouveau bouton blanc */}
          <a href="#contact" className="btn btnWhite">
            Contactez-nous
          </a>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="section about">
        <motion.img
          src="/images/Navy Minimalist Letter D Logo.png"
          alt="Cours de Physique"
          className="sectionImage"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
        <motion.div
          className="sectionContent"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2>À propos de PcDirac</h2>
          <p>
            PcDirac est une plateforme complète dédiée à l’apprentissage de la
            physique et de la chimie pour tous les niveaux. Elle fournit un
            contenu pédagogique riche, structuré et facile à comprendre, allant
            des concepts de base aux notions avancées. Chaque cours est
            accompagné d’exemples pratiques, d’exercices détaillés et d’activités
            interactives pour aider les étudiants à mieux assimiler les matières.
            Notre mission est de faciliter l’apprentissage, de stimuler la
            curiosité scientifique et de permettre à chaque étudiant de progresser
            à son rythme, tout en rendant l’expérience d’apprentissage engageante
            et motivante.
          </p>
        </motion.div>
      </section>

      {/* Courses Section */}
      <section className="section courses">
        <motion.div
          className="sectionContent"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2>Cours en ligne</h2>
          <p>
            PCDirac propose également des cours en ligne pour tous les niveaux.
            Pour plus d’informations, contactez-nous via nos pages officielles sur
            Instagram, TikTok ou Facebook.
          </p>
        </motion.div>
        <motion.img
          src="/images/courses_image.jpg"
          alt="Cours"
          className="sectionImage"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
      </section>

      {/* ✅ Contact Section */}
      <section id="contact" className="section contact">
        <motion.div
          className="contactContent"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2>Contacter nous pour plus d'information</h2>
          <a
            href="https://wa.me/212609861558"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsappLink"
          >
            <img
              src="/images/whatsapp.png"
              alt="WhatsApp"
              className="whatsappIcon"
            />
            Whatsapp
          </a>
        </motion.div>
        <motion.img
          src="/images/Cours En Ligne.png"
          alt="Contact"
          className="sectionImage"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
