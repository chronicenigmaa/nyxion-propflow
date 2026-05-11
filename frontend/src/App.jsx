import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";

import { AppShell }      from "./layout/AppShell.jsx";
import { LoginPage }     from "./auth/Login.jsx";
import { SignupPage }    from "./auth/Signup.jsx";
import { ForgotPage }    from "./auth/ForgotPassword.jsx";

import { DashboardPage }  from "./pages/Dashboard.jsx";
import { ClientsPage }    from "./pages/Clients.jsx";
import { PaymentsPage }   from "./pages/Payments.jsx";
import { NudgesPage }     from "./pages/Nudges.jsx";
import { RisksPage }      from "./pages/Risks.jsx";
import { UnitsPage }      from "./pages/Units.jsx";
import { DocParserPage }  from "./pages/DocParser.jsx";
import { PlaceholderPage } from "./pages/Placeholder.jsx";
import { ProjectsPage }   from "./pages/Projects.jsx";
import { BookingsPage }   from "./pages/Bookings.jsx";
import { LeasesPage }     from "./pages/Leases.jsx";
import { FinancialsPage } from "./pages/Financials.jsx";
import { WhatsAppPage }   from "./pages/WhatsApp.jsx";

function Protected({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return (
    <div className="flex h-screen items-center justify-center text-gray-400 text-sm">Loading…</div>
  );
  // Uncomment when Supabase is live:
  // if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { init } = useAuthStore();
  useEffect(() => { init(); }, []);

  return (
    <Routes>
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot" element={<ForgotPage />} />

      <Route element={<Protected><AppShell /></Protected>}>
        <Route path="/"           element={<DashboardPage />} />
        <Route path="/clients"    element={<ClientsPage />} />
        <Route path="/projects"   element={<ProjectsPage />} />
        <Route path="/units"      element={<UnitsPage />} />
        <Route path="/bookings"   element={<BookingsPage />} />
        <Route path="/leases"     element={<LeasesPage />} />
        <Route path="/payments"   element={<PaymentsPage />} />
        <Route path="/financials" element={<FinancialsPage />} />
        <Route path="/whatsapp"   element={<WhatsAppPage />} />
        <Route path="/nudges"     element={<NudgesPage />} />
        <Route path="/risks"      element={<RisksPage />} />
        <Route path="/docparser"  element={<DocParserPage />} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}