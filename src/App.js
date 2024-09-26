import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import Party from "./pages/Party";
import SuggestionsPage from "./pages/SuggestionPage";

const App = () => {
  return (
    <div>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/anotador" element={<Party />} />
          <Route path="/reglas" />
          <Route path="/sugerencias" element={<SuggestionsPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
