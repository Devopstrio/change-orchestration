import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Settings, Bell } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ChangeRequestForm from './pages/ChangeRequestForm';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center font-bold">C</div>
            <span className="text-xl font-bold tracking-tight">Orchestrator</span>
          </div>
          
          <nav className="flex-1 space-y-2">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Overview" />
            <NavItem to="/new" icon={<PlusCircle size={20} />} label="New Change" />
            <NavItem to="/history" icon={<History size={20} />} label="Audit Trail" />
            <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
          </nav>

          <div className="pt-6 border-t border-slate-800">
            <button className="flex items-center gap-3 text-slate-400 hover:text-white transition">
              <Bell size={20} />
              <span>Notifications</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <header className="h-16 border-b border-slate-800 flex items-center justify-end px-8">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">admin@devopstrio.com</span>
              <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
            </div>
          </header>

          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<ChangeRequestForm />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

const NavItem = ({ to, icon, label }: any) => (
  <Link to={to} className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition">
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

export default App;
