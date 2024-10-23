import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Party from "./components/Party";
import LandingPage from "./pages/LandingPage";
import RulesPage from "./pages/RulesPage";
import Anotador from "./pages/Anotador";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/anotador" element={<Party />} />
        <Route path="/reglas" element={<RulesPage />} />
        <Route path="/sugerencias" element={<Anotador />} />
      </Routes>
    </Router>
  );
};

export default App;
