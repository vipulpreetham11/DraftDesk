import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Plus, Calendar, FolderOpen, Lightbulb, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditorRoute = location.pathname === '/new' || location.pathname.startsWith('/edit');

  const displayName = (user as any)?.profile?.name || (user as any)?.metadata?.name || user?.email?.split('@')[0] || 'Creator';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-warm-50 min-h-screen text-charcoal font-body flex flex-col md:flex-row selection:bg-coral-100 selection:text-coral-800 pb-20 md:pb-0">
      
      {/* MOBILE TOP BAR (Only visible on small screens and not in editor) */}
      {!isEditorRoute && (
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-warm-200 shadow-sm flex justify-between items-center w-full px-4 h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-warm-200 border-2 border-coral-400 flex items-center justify-center font-heading font-bold text-coral-800 text-sm overflow-hidden">
            <span className="text-sm">{initial}</span>
          </div>
          <h1 className="font-heading text-xl font-bold text-coral-400">DraftDesk</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-warm-100 rounded-full transition-colors active:opacity-80">
          <Bell className="text-coral-400 w-5 h-5" />
        </button>
      </header>
      )}

      {/* DESKTOP SIDEBAR (Hidden on small screens and editor routes) */}
      {!isEditorRoute && (
        <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-warm-100 border-r border-warm-200 flex-col p-6 z-30">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-coral-400">DraftDesk</h1>
          <p className="font-body text-xs text-warm-500 font-semibold tracking-wide uppercase mt-1">Content Planner</p>
        </div>

        <button 
          onClick={() => navigate('/new')}
          className="mb-8 w-full bg-coral-400 text-white py-3 rounded-[10px] font-body text-sm font-semibold flex items-center justify-center gap-2 hover:bg-coral-600 transition-colors shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>

        <nav className="flex-1 flex flex-col gap-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-body text-sm font-bold ${
              location.pathname === '/dashboard'
                ? 'bg-warm-200 text-coral-600 border-l-4 border-coral-400'
                : 'text-warm-700 hover:bg-warm-200/50 hover:text-charcoal'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 text-warm-400 font-body text-sm font-semibold opacity-50 cursor-not-allowed">
            <Settings className="w-5 h-5" />
            Settings
          </div>
        </nav>

        {/* User Profile (Desktop Bottom) */}
        <div className="mt-auto pt-6 border-t border-warm-200 flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-warm-200 flex items-center justify-center font-heading font-bold text-charcoal text-sm shrink-0">
             {initial}
           </div>
           <div className="overflow-hidden">
             <p className="font-body text-sm font-bold text-charcoal truncate">{displayName}</p>
             <p className="font-body text-xs text-warm-500 truncate">{user?.email || 'No email'}</p>
           </div>
        </div>
      </aside>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <main className={`flex-1 w-full ${isEditorRoute ? '' : 'md:ml-64'}`}>
        <Outlet />
      </main>

      {/* MOBILE BOTTOM NAV BAR (Only visible on small screens and not in editor) */}
      {!isEditorRoute && (
        <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 pt-2 pb-6 bg-white shadow-[0_-2px_10px_rgba(45,42,38,0.05)] z-50 rounded-t-xl border-t border-warm-200">
        <Link to="/dashboard" className="flex flex-col items-center justify-center bg-coral-50 text-coral-600 rounded-xl px-4 py-2 active:scale-95 transition-all">
          <Calendar className="w-6 h-6 mb-1" />
          <span className="font-body text-[11px] font-bold">Planner</span>
        </Link>
        <div className="flex flex-col items-center justify-center text-warm-500 px-4 py-2 opacity-50 cursor-not-allowed">
          <FolderOpen className="w-6 h-6 mb-1" />
          <span className="font-body text-[11px] font-semibold">Assets</span>
        </div>
        <div className="flex flex-col items-center justify-center text-warm-500 px-4 py-2 opacity-50 cursor-not-allowed">
          <Lightbulb className="w-6 h-6 mb-1" />
          <span className="font-body text-[11px] font-semibold">Ideas</span>
        </div>
        <div className="flex flex-col items-center justify-center text-warm-500 px-4 py-2 opacity-50 cursor-not-allowed">
          <Settings className="w-6 h-6 mb-1" />
          <span className="font-body text-[11px] font-semibold">Settings</span>
        </div>
      </nav>
      )}

      {/* MOBILE FLOATING ACTION BUTTON */}
      {!isEditorRoute && (
      <button 
        onClick={() => navigate('/new')}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-coral-400 text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-all z-40"
      >
        <Plus className="w-8 h-8" />
      </button>
      )}

    </div>
  );
};

export default DashboardLayout;
