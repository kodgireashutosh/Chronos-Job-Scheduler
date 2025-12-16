import {
  LayoutDashboard,
  List,
  Settings,
  LogOut,
  Clock
} from 'lucide-react';
/**
 * Sidebar Layout
 * UI extracted as-is from App.jsx
 */
export default function Sidebar({
  currentScreen,
  onNavigate,
  onLogout
}) {

  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => onNavigate(id)}
      className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 mb-1 ${
        currentScreen === id
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon
        className={`mr-3 h-5 w-5 flex-shrink-0 ${
          currentScreen === id
            ? 'text-white'
            : 'text-slate-500 group-hover:text-slate-300'
        }`}
      />
      {label}
    </button>
  );

  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
      <div className="flex flex-col flex-grow bg-slate-900 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-10">
          <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
            <Clock className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Chronos
          </h1>
        </div>

        <div className="mt-2 flex-grow flex flex-col px-4">
          <nav className="flex-1 space-y-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Main Menu
            </p>

            <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <NavItem id="jobs" label="All Jobs" icon={List} />
            <NavItem id="settings" label="Configuration" icon={Settings} />
          </nav>
        </div>

        <div className="flex-shrink-0 flex p-6">
          <button
            onClick={onLogout}
            className="flex-shrink-0 w-full group block bg-slate-800 p-4 rounded-xl hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                AD
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-white group-hover:text-white">
                  Admin User
                </p>
                <p className="text-xs font-medium text-slate-400 group-hover:text-slate-300">
                  View Profile
                </p>
              </div>
              <LogOut className="ml-auto h-4 w-4 text-slate-400 group-hover:text-white" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
