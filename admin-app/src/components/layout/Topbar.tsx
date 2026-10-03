import React from 'react';
import { Menu, ShieldCheck, Database, Server } from 'lucide-react';
import { useAdminAuth } from '../../context/AuthContext';

interface TopbarProps {
  onOpenMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileSidebar }) => {
  const { adminUser } = useAdminAuth();

  return (
    <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
            PostgreSQL Cluster Connected
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-slate-300">
          <Server className="w-3.5 h-3.5 text-sky-400" />
          <span>Shared Express Backend API: <strong>:5000</strong></span>
        </div>

        <div className="text-right">
          <span className="block text-xs font-bold text-white">{adminUser?.name}</span>
          <span className="block text-[10px] text-sky-400 font-semibold uppercase">{adminUser?.role}</span>
        </div>
      </div>
    </header>
  );
};
