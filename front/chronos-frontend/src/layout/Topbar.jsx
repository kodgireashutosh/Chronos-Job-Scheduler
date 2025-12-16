import { Search, Bell, ChevronRight } from 'lucide-react';

/**
 * Top Navigation Bar
 * UI extracted as-is from App.jsx
 */
export default function Topbar({ currentScreen }) {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex-1 px-8 flex justify-between">
        <div className="flex-1 flex items-center">
          <div className="hidden md:flex items-center text-sm text-slate-500">
            <span className="hover:text-slate-900 cursor-pointer">
              Chronos
            </span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-semibold text-slate-900 capitalize">
              {currentScreen}
            </span>
          </div>
        </div>

        <div className="ml-4 flex items-center md:ml-6 space-x-6">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-0 top-1/2 transform -translate-y-1/2" />
            <input
              className="pl-8 bg-transparent border-none text-sm focus:ring-0 placeholder-slate-400"
              placeholder="Quick search..."
            />
          </div>

          <button className="relative bg-white p-2 rounded-full text-slate-400 hover:text-blue-600 focus:outline-none transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
            <span className="absolute top-1.5 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
