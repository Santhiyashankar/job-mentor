import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import ApplicationDetail from "./pages/ApplicationDetail";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AIInsightsPage from "./pages/AIInsightsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
           <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="ai_insights" element={<AIInsightsPage />} />
  <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route
  path="/dashboard/applications/:id"
  element={<ApplicationDetail />}
/>

      </Routes>
    </BrowserRouter>
  );
}
