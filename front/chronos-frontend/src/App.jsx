import { useState } from "react";
import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";
import DashboardScreen from "./features/dashboard/DashboardScreen";
import JobsListScreen from "./features/jobs/JobsListScreen";
import SettingsScreen from "./features/settings/SettingsScreen";
import SignupScreen from "./features/auth/SignupScreen";
import ForgotPasswordScreen from "./features/auth/ForgotPassword";
import LoginScreen from "./features/auth/LoginScreen";
import JobDetailsModal from "./features/jobs/JobDetailsModal";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen("login");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return <DashboardScreen />;
      case "jobs":
        return <JobsListScreen onSelectJob={setSelectedJob} />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  if (!isLoggedIn) {
    if (currentScreen === "signup")
      return <SignupScreen onNavigate={setCurrentScreen} />;
    if (currentScreen === "forgot-password")
      return <ForgotPasswordScreen onNavigate={setCurrentScreen} />;
    return <LoginScreen onLogin={handleLogin} onNavigate={setCurrentScreen} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onLogout={handleLogout}
      />

      <div className="md:pl-72 flex flex-col flex-1">
        <Topbar currentScreen={currentScreen} />

        <main className="flex-1 bg-slate-50">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {renderScreen()}
            </div>
          </div>
        </main>
      </div>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default App;
