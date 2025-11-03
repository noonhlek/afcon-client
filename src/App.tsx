import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './components/auth/ProtectedRoute'; // ADD THIS
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { BracketPage } from './pages/BracketPage';
import { TopScorersPage } from './pages/TopScorersPage';
import { FederationDashboard } from './pages/federation/FederationDashboard';
import { TeamRegistration } from './pages/federation/TeamRegistration';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MatchManagement } from './pages/admin/MatchManagement';
import { VerifyForm } from './components/auth/VerifyForm';
import { AdminProvider } from './hooks/useAdmin';
import { FederationProvider } from './hooks/useFederation';

function AppContent() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {location.pathname !== '/verify' && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/bracket" element={<BracketPage />} />
        <Route path="/scorers" element={<TopScorersPage />} />
        <Route path="/verify" element={<VerifyForm />} />
        {/* PROTECTED FEDERATION ROUTES */}
        <Route
          path="/federation/dashboard"
          element={
            <ProtectedRoute requiredRole="federation">
              <FederationDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/federation/register"
          element={
            <ProtectedRoute requiredRole="federation">
              <TeamRegistration />
            </ProtectedRoute>
          }
        />
        {/* PROTECTED ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/matches"
          element={
            <ProtectedRoute requiredRole="admin">
              <MatchManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
      <footer className="border-t-2 border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
          &copy; {new Date().getFullYear()} African Nations League. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <FederationProvider>
          <Router>
            <AppContent />
          </Router>
        </FederationProvider>
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;