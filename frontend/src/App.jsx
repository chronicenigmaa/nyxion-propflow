import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";

// Layout
import { AppShell } from "./layout/AppShell.jsx";

// Auth pages
import { LoginPage }        from "./auth/Login.jsx";
import { SignupPage }       from "./auth/Signup.jsx";
import { ForgotPage }       from "./auth/ForgotPassword.jsx";

// App pages
import { DashboardPage }   from "./pages/Dashboard.jsx";
import { ClientsPage }     from "./pages/Clients.jsx";
import { UnitsPage }       from "./pages/Units.jsx";
import { PaymentsPage }    from "./pages/Payments.jsx";
import { WhatsAppPage }    from "./pages/WhatsApp.jsx";
import { NudgesPage }      from "./pages/Nudges.jsx";
import { RisksPage }       from "./pages/Risks.jsx";
import { DocParserPage }   from "./pages/DocParser.jsx";
import { PlaceholderPage } from "./pages/Placeholder.jsx";

// Route guard — redirects to /login if not authenticated
function Protected({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return <div className="flex h-screen items-center justify-center text-gray-400 text-sm">Loading…</div>;
  // Uncomment when Supabase is wired up:
  // if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { init } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot" element={<ForgotPage />} />

      {/* App — protected */}
      <Route element={<Protected><AppShell /></Protected>}>
        <Route path="/"          element={<DashboardPage />} />
        <Route path="/clients"   element={<ClientsPage />} />
        <Route path="/units"     element={<UnitsPage />} />
        <Route path="/payments"  element={<PaymentsPage />} />
        <Route path="/whatsapp"  element={<WhatsAppPage />} />
        <Route path="/nudges"    element={<NudgesPage />} />
        <Route path="/risks"     element={<RisksPage />} />
        <Route path="/docparser" element={<DocParserPage />} />
        <Route path="/bookings"  element={<PlaceholderPage title="Bookings" icon="ti-calendar-event" />} />
        <Route path="/leases"    element={<PlaceholderPage title="Leases" icon="ti-file-text" />} />
        <Route path="/forecast"  element={<PlaceholderPage title="Revenue Forecast" icon="ti-trending-up" />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
