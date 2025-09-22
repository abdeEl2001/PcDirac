// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Acceuil from "./pages/Acceuil";
import Videos from "./pages/Videos";
import Lycce from "./pages/Lycee";
import Licence from "./pages/Licence";
import Agregation from "./pages/Agregation";

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
          <Route path="/videos" element={<Videos/>}/>
          <Route path="/lycee" element={<Lycce />} />
          <Route path="/licence" element={<Licence/>}/>
          <Route path="/agregation" element={<Agregation/>}/>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
