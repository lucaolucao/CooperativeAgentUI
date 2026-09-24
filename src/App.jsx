import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import RankingPage from "./pages/RankingPage";

import "./App.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/scenario/:scenario"
          element={<RankingPage />}
        />

        <Route
          path="*"
          element={<Navigate to="/scenario/moon" replace />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;