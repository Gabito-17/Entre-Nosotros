import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.tsx";
import AboutUs from "./pages/AboutUs";
import Game from "./pages/AnotattorBritneyPage.tsx";
import AnotadorTrucoPage from "./pages/AnotattorTrucoPage.tsx";
import LandingPage from "./pages/LandingPage";
import RulesPage from "./pages/RulesBritneyPage.js";
import SuggestionsPage from "./pages/SuggestionPage";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/reglas" element={<RulesPage />} />
          <Route path="/sugerencias" element={<SuggestionsPage />} />
          <Route path="/nosotros" element={<AboutUs />} />
          <Route path="/anotador" element={<Game />} />
          <Route path="/anotador-truco" element={<AnotadorTrucoPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
