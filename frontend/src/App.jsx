import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddExpense from "./pages/AddExpense.jsx";
import ExpenseHistory from "./pages/ExpenseHistory.jsx";
import Settlement from "./pages/Settlement.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";
import RoomMembers from "./pages/RoomMembers.jsx";
import Reports from "./pages/Reports.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

// "/" → Dashboard when signed in, otherwise the marketing landing page.
// Inside the native mobile app we skip the landing page and go straight to login.
function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night">
        <p className="font-mono text-sm text-paper/60 tracking-wide">Hisab khul raha hai…</p>
      </div>
    );
  }
  if (user) return <Dashboard />;
  if (window.Capacitor?.isNativePlatform?.()) return <Navigate to="/login" replace />;
  return <Landing />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><ExpenseHistory /></ProtectedRoute>} />
      <Route path="/settlement" element={<ProtectedRoute><Settlement /></ProtectedRoute>} />
      <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
      <Route path="/members" element={<ProtectedRoute><RoomMembers /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
