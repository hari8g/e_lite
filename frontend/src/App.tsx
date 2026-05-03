import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Onboarding } from "./pages/Onboarding";
import { TelematicsPage } from "./pages/Telematics";
import { FleetConfigPage } from "./pages/FleetConfig";
import { MaintenancePage } from "./pages/Maintenance";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="onboard" element={<Onboarding />} />
        <Route path="telematics" element={<TelematicsPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="config" element={<FleetConfigPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
