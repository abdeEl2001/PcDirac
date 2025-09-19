import React from "react";
import { motion } from "framer-motion";
import "./style/Acceuil_style.css";
import { Link } from "react-router-dom";

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
      Une plateforme moderne pour apprendre la <strong>Physique</strong> et la <strong>Chimie</strong> 
       à travers des cours interactifs, des exercices pratiques et des activités engageantes.
    </motion.p>


  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1, duration: 0.8 }}
    className="heroButtons"
  >

    <Link to="/cours" className="btn btnOrange">
    Découvrir les cours
    </Link>
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
            PcDirac est une plateforme complète dédiée à l’apprentissage de la physique et de la chimie pour tous les niveaux. 
            Elle fournit un contenu pédagogique riche, structuré et facile à comprendre, allant des concepts de base 
            aux notions avancées. Chaque cours est accompagné d’exemples pratiques, d’exercices détaillés et 
            d’activités interactives pour aider les étudiants à mieux assimiler les matières. 
            Notre mission est de faciliter l’apprentissage, de stimuler la curiosité scientifique et de permettre 
            à chaque étudiant de progresser à son rythme, tout en rendant l’expérience d’apprentissage engageante et motivante.
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
          <h2>Cours de Physique et Chimie</h2>
          <p>
            Explorez une vaste collection de cours de physique et de chimie couvrant tous les niveaux, 
            des notions élémentaires aux concepts les plus avancés. Chaque cours est expliqué de manière claire, 
            avec des illustrations et des exemples concrets pour faciliter la compréhension. 
            Les étudiants peuvent suivre les modules à leur propre rythme, revoir les points difficiles et consolider 
            leurs connaissances pour réussir dans leurs études et examens.
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

      {/* Exercises Section */}
      <section className="section exercises">
        <motion.img
          src="/images/Exercices_image.png"
          alt="Exercices"
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
          <h2>Exercices Pratiques</h2>
          <p>
            Testez vos connaissances avec une variété d’exercices pratiques en physique et chimie conçus pour renforcer votre compréhension des concepts. 
            Chaque exercice est accompagné d’explications détaillées et de corrections, vous permettant de corriger vos erreurs 
            et d’apprendre de manière autonome.
          </p>
        </motion.div>
      </section>

      {/* Activities Section */}
      <section className="section activities">
        <motion.div
          className="sectionContent"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2>Activités Interactives</h2>
          <p>
            Participez à des activités interactives et des expériences virtuelles conçues pour rendre l’apprentissage 
            de la <strong>physique et de la chimie</strong> plus engageant. 
            Ces activités permettent d’appliquer les concepts appris dans les cours et de développer une compréhension pratique. 
            Elles favorisent également la collaboration et la créativité, rendant l’apprentissage plus dynamique et amusant.
          </p>
        </motion.div>
        <motion.img
          src="/images/Activities_image.png"
          alt="Activités"
          className="sectionImage"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} PcDirac. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
