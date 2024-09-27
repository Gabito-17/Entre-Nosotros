import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import Party from "./pages/Party";
import RulesPage from "./pages/RulesPage";
import SuggestionsPage from "./pages/SuggestionPage";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/anotador" element={<Party />} />
        <Route path="/reglas" element={<RulesPage />} />
        <Route path="/sugerencias" element={<SuggestionsPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
