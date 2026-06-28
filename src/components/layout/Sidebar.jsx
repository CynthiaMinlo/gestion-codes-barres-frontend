import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Package, Barcode, Printer, ArrowLeftRight,
  ScanLine, Tag, Truck, Users, BarChart3, LogOut, ScanBarcode, ChevronRight,
} from 'lucide-react';

const menu = [
  { section: null, items: [{ to:'/dashboard', icon:LayoutDashboard, label:'Tableau de bord' }] },
  { section:'Catalogue', items: [
    { to:'/produits',     icon:Package,  label:'Produits'     },
    { to:'/codes-barres', icon:Barcode,  label:'Codes-barres' },
    { to:'/impressions',  icon:Printer,  label:'Impressions'  },
  ]},
  { section:'Stock', items: [
    { to:'/mouvements', icon:ArrowLeftRight, label:'Mouvements' },
    { to:'/scans',      icon:ScanLine,       label:'Scanner'    },
  ]},
  { section:'Administration', items: [
    { to:'/categories',   icon:Tag,       label:'Catégories'   },
    { to:'/fournisseurs', icon:Truck,     label:'Fournisseurs' },
    { to:'/utilisateurs', icon:Users,     label:'Utilisateurs' },
    { to:'/rapports',     icon:BarChart3, label:'Rapports'     },
  ]},
];

export default function Sidebar() {
  const { utilisateur, logout } = useAuth();
  const navigate = useNavigate();
  const initiales = utilisateur?.nom?.slice(0,2).toUpperCase() || 'U';

  const handleLogout = async () => {
    await logout();
    toast.success('Déconnecté');
    navigate('/login');
  };

  return (
    <aside style={{ width:'260px' }} className="fixed top-0 left-0 h-screen flex flex-col z-40 bg-primary-800">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="bg-white/15 p-2 rounded-xl"><ScanBarcode className="w-5 h-5 text-white"/></div>
        <div>
          <p className="text-white font-bold text-sm leading-none">GestionCodes</p>
          <p className="text-white/40 text-[10px] mt-0.5 font-medium tracking-wide uppercase">Codes-barres PME</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {menu.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'pt-2' : ''}>
            {group.section && (
              <p className="px-3 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">{group.section}</p>
            )}
            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 ${
                    isActive ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (<>
                  <Icon size={17} className="flex-shrink-0"/>
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={13} className="opacity-50"/>}
                </>)}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary-400/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initiales}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{utilisateur?.nom || 'Utilisateur'}</p>
            <p className="text-white/40 text-[10px] capitalize truncate">{utilisateur?.role || ''}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-white/50 hover:bg-white/10 hover:text-white text-xs font-medium transition-all">
          <LogOut size={14}/>Déconnexion
        </button>
      </div>
    </aside>
  );
}
