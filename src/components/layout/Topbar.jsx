import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export default function Topbar({ titre }) {
  const { utilisateur } = useAuth();
  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <h1 className="text-base font-semibold text-slate-800">{titre}</h1>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell size={18} className="text-slate-500"/>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/>
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
            {utilisateur?.nom?.slice(0,2).toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-700 leading-none">{utilisateur?.nom}</p>
            <p className="text-[10px] text-slate-400 capitalize mt-0.5">{utilisateur?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
