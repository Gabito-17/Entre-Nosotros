import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GameSelector from "./components/GameSelector";
import NavBar from "./components/Layout/NavBar";
import AboutUs from "./pages/AboutUs";
import Annotator from "./pages/Annotator";
import LandingPage from "./pages/LandingPage";
import RulesPage from "./pages/RulesPage";
import SuggestionsPage from "./pages/SuggestionPage";

const App = () => {
  return (
    <Router>
      {" "}
      <NavBar />
      <div className="mt-20">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/anotador" element={<Annotator />} />
          <Route path="/reglas" element={<RulesPage />} />
          <Route path="/sugerencias" element={<SuggestionsPage />} />
          <Route path="/nosotros" element={<AboutUs />} />
          <Route path="/selector-partida" element={<GameSelector />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
