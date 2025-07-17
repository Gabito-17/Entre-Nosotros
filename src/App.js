import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.tsx";

import HomePage from "./pages/HomePage.tsx";
import SuggestionsPage from "./pages/SuggestionPage.tsx";

// Mafia
import RulesMafiaPage from "./components/Mafia/pages/RulesMafiaPage.tsx";
import MafiaPage from "./components/Mafia/pages/MafiaPage.tsx";
import MafiaGamePage from "./components/Mafia/pages/MafiaGamePage.tsx";
import { CreateRoomPage } from "./components/Mafia/pages/CreateRoomPage.tsx";

// Britney
import BritneyPage from "./components/Britney/pages/BritneyPage.tsx";
import RulesBritneyPage from "./components/Britney/pages/RulesBritneyPage.tsx";
import AnotattorBritneyPage from "./components/Britney/pages/AnotattorBritneyPage.tsx";

// Truco
import TrucoPage from "./components/Truco/pages/TrucoPage.tsx";
import RulesTrucoPage from "./components/Truco/pages/TrucoRulesPage.tsx";
import AnotadorTrucoPage from "./components/Truco/pages/AnotattorTrucoPage.tsx";

// User
import { UserInfo } from "./components/Users/UserInfo.tsx";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home and general */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sugerencias" element={<SuggestionsPage />} />

          {/* Britney routes */}
          <Route path="/britney" element={<BritneyPage />} />
          <Route path="/britney/reglas" element={<RulesBritneyPage />} />
          <Route path="/britney/anotador" element={<AnotattorBritneyPage />} />

          {/* Truco routes */}
          <Route path="/truco" element={<TrucoPage />} />
          <Route path="/truco/reglas" element={<RulesTrucoPage />} />
          <Route path="/truco/anotador" element={<AnotadorTrucoPage />} />
          
          {/* Mafia routes */}
          <Route path="/mafia/game" element={<MafiaGamePage />} />
          <Route path="/mafia/reglas" element={<RulesMafiaPage />} />
          <Route path="/mafia" element={<MafiaPage />} />
          <Route path="/mafia/crear-sala" element={<CreateRoomPage />} />

          {/* Usuario routes */}
          <Route path="/user/info" element={<UserInfo />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
