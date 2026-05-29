import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fullpage-spinner">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
