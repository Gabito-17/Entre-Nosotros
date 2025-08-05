import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout.tsx";

import HandleLoginPage from "./pages/handleLoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import SuggestionsPage from "./pages/SuggestionPage.tsx";

// Mafia
import { CreateRoomPage } from "./components/Mafia/pages/CreateRoomPage.tsx";
import MafiaGamePage from "./components/Mafia/pages/MafiaGamePage.tsx";
import MafiaPage from "./components/Mafia/pages/MafiaPage.tsx";
import RulesMafiaPage from "./components/Mafia/pages/RulesMafiaPage.tsx";

// Britney
import AnotattorBritneyPage from "./components/Britney/pages/AnotattorBritneyPage.tsx";
import BritneyPage from "./components/Britney/pages/BritneyPage.tsx";
import RulesBritneyPage from "./components/Britney/pages/RulesBritneyPage.tsx";

// Truco
import AnotadorTrucoPage from "./components/Truco/pages/AnotattorTrucoPage.tsx";
import TrucoPage from "./components/Truco/pages/TrucoPage.tsx";
import RulesTrucoPage from "./components/Truco/pages/TrucoRulesPage.tsx";

// User
import { JoinRoomPage } from "./components/Mafia/pages/JoinRoomPage.tsx";
import ProfileSettings from "./components/Users/ProfileSettings.tsx";
import { UserInfo } from "./components/Users/UserInfo.tsx";
import { PlayerProvider } from "./hooks/PlayerProvider";
import { UserProvider } from "./hooks/UserProvider.tsx";

const App = () => {
  return (
    <Router>
      <Layout>
        <UserProvider>
          <PlayerProvider>
            <Routes>
              {/* Home and general */}
              <Route path="/" element={<HomePage />} />
              <Route path="/sugerencias" element={<SuggestionsPage />} />
              <Route path="/handle-login" element={<HandleLoginPage />} />

              {/* Britney routes */}
              <Route path="/britney" element={<BritneyPage />} />
              <Route path="/britney/reglas" element={<RulesBritneyPage />} />
              <Route
                path="/britney/anotador"
                element={<AnotattorBritneyPage />}
              />

              {/* Truco routes */}
              <Route path="/truco" element={<TrucoPage />} />
              <Route path="/truco/reglas" element={<RulesTrucoPage />} />
              <Route path="/truco/anotador" element={<AnotadorTrucoPage />} />

              {/* Mafia routes */}
              <Route path="/mafia/game" element={<MafiaGamePage />} />
              <Route path="/mafia/reglas" element={<RulesMafiaPage />} />
              <Route path="/mafia" element={<MafiaPage />} />
              <Route path="/mafia/crear-sala" element={<CreateRoomPage />} />
              <Route path="/room/:paramsRoomId" element={<JoinRoomPage />} />

              {/* Usuario routes */}
              <Route path="/perfil/info" element={<UserInfo />} />
              <Route path="/perfil/settings" element={<ProfileSettings />} />
            </Routes>
          </PlayerProvider>
        </UserProvider>
      </Layout>
    </Router>
  );
};

export default App;
