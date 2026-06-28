import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const titles = {
  '/dashboard':'Tableau de bord', '/produits':'Gestion des produits',
  '/codes-barres':'Codes-barres', '/impressions':'Impressions',
  '/mouvements':'Mouvements de stock', '/scans':'Scanner',
  '/categories':'Catégories', '/fournisseurs':'Fournisseurs',
  '/utilisateurs':'Utilisateurs', '/rapports':'Rapports & Statistiques',
};

export default function Layout({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen">
      <Sidebar/>
      <div className="flex-1 flex flex-col" style={{ marginLeft:'260px' }}>
        <Topbar titre={titles[pathname] || 'GestionCodes'}/>
        <main className="flex-1 p-6 fade-in">{children}</main>
      </div>
    </div>
  );
}
