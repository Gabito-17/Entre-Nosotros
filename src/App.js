import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import Game from "./components/Britney/pages/AnotattorBritneyPage.tsx";
import AnotadorTrucoPage from "./components/Truco/pages/AnotattorTrucoPage.tsx";
import BritneyPage from "./components/Britney/pages/BritneyPage.tsx";
import RulesPage from "./components/Britney/pages/RulesBritneyPage.tsx";
import SuggestionsPage from "./pages/SuggestionPage.tsx";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="britney/reglas" element={<RulesPage />} />
          <Route path="/sugerencias" element={<SuggestionsPage />} />
          <Route path="britney" element={<BritneyPage />} />
          <Route path="britney/anotador" element={<Game />} />
          <Route path="truco/anotador" element={<AnotadorTrucoPage />} />
        </Routes>   
      </Layout>
    </Router>
  );
};

export default App;
