import { Routes, Route, Navigate } from "react-router-dom";

import OfficerMain from "./pages/officer/officer_main/officer_main";
import OfficerDashboard from "./pages/officer/personnel_status/officer_dashboard/officer_dashboard";
import OfficerPersonnelCheck from "./pages/officer/personnel_status/officer_PersonnelCheck/officer_PersonnelCheck.jsx";
import OfficerSchedule from "./pages/officer/officer_Schedule/officer_Schedule.jsx";
import MobileUnitSchedule from "./pages/officer/mobile_unit_schedule/MobileUnitSchedule.jsx";
import DutyCheck from "./pages/soldier/mobile/duty_check/duty_check";
import MobileMain from "./pages/soldier/mobile/main/main";
import MobileState from "./pages/soldier/mobile/state/state";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/officer/main" replace />} />
      <Route path="/officer/main" element={<OfficerMain />} />
      <Route path="/officer/dashboard" element={<OfficerDashboard />} />
      <Route
        path="/officer/personnel-check"
        element={<OfficerPersonnelCheck />}
      />
      <Route path="/officer/schedule" element={<OfficerSchedule />} />
      <Route path="/officer/mobile-schedule" element={<MobileUnitSchedule />} />
      <Route path="/soldier/mobile/duty-check" element={<DutyCheck />} />
      <Route path="/soldier/mobile/main" element={<MobileMain />} />
      <Route path="/soldier/mobile/state" element={<MobileState />} />
    </Routes>
  );
}

export default App;
