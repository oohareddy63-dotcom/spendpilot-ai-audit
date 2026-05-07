import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuditFormPage from "./pages/AuditFormPage";
import ResultsPage from "./pages/ResultsPage";
import SharePage from "./pages/SharePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/audit" element={<AuditFormPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/share/:id" element={<SharePage />} />
    </Routes>
  );
}

export default App;
