import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import Party from "./pages/Party";
import SuggestionPage from "./pages/SuggestionPage";
import RulesPage from "./pages/RulesPage";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/anotador" element={<Party />} />
        <Route path="/reglas" element={<RulesPage />} />
        <Route path="/sugerencias" element={<SuggestionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
