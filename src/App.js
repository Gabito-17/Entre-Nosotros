import React from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import Party from "./pages/Party";
import RulesPage from "./pages/RulesPage";
import SuggestionsPage from "./pages/SuggestionPage";

const App = () => {
  return (
    <div>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/anotador" element={<Party />} />
          <Route path="/reglas" element={<RulesPage />} />
          <Route path="/sugerencias" element={<SuggestionsPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
