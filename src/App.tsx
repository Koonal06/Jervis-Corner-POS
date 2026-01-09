import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner@2.0.3";
import { AppProvider } from "./contexts/AppContext";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { AdminDashboard } from "./components/AdminDashboard";
import { POSOrdering } from "./components/POSOrdering";
import { KitchenDisplay } from "./components/KitchenDisplay";
import { InventoryManagement } from "./components/InventoryManagement";
import { MenuManagement } from "./components/MenuManagement";
import { StaffManagement } from "./components/StaffManagement";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AppProvider>
      <Router>
        <div className="flex h-screen overflow-hidden">
          <Sidebar onLogout={handleLogout} userRole={userRole} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <MobileNav onLogout={handleLogout} userRole={userRole} />
            <main className="flex-1 overflow-y-auto bg-neutral-100">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/pos" element={<POSOrdering />} />
                <Route path="/kitchen" element={<KitchenDisplay />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/menu" element={<MenuManagement />} />
                <Route path="/staff" element={<StaffManagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster 
          position="top-right" 
          richColors 
          expand={true}
          duration={3000}
        />
      </Router>
    </AppProvider>
  );
}