// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Acceuil from "./pages/Acceuil";
import Cours from "./pages/Cours";
import Exercices from "./pages/Exercices";
import Activities from "./pages/Activities";
import DevoirSurveille from "./pages/DevoirSurveille";
import DocumentsPedagogiques from "./pages/DocumentsPedagogiques";
import ExamensNationaux from "./pages/ExamensNationaux";

function App() {
  return (
    <Router>
      <header>
        <Navbar /> {/* Navbar inside header */}
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/acceuil" replace />} />
          <Route path="/acceuil" element={<Acceuil />} />
          <Route path="/cours" element={<Cours />} />
          <Route path="/exercices" element={<Exercices />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/devoirSurveille" element={<DevoirSurveille/>}/>
          <Route path="/documentsPedagogiques" element={<DocumentsPedagogiques/>}/>
          <Route path="/examensNationaux" element={<ExamensNationaux/>}/>
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </Router>
  );
}

export default App;
