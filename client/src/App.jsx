import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import AuditFormPage from "./pages/AuditFormPage";
import ResultsPage from "./pages/ResultsPage";
import SharePage from "./pages/SharePage";

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1f3a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#34d399", secondary: "#1a1f3a" },
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "#1a1f3a" },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/audit" element={<AuditFormPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/share/:id" element={<SharePage />} />
      </Routes>
    </>
  );
}

export default App;
