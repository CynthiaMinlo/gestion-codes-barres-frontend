import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Landing      from './pages/Landing';
import Login        from './pages/auth/Login';
import Dashboard    from './pages/Dashboard';
import Produits     from './pages/produits/Produits';
import Categories   from './pages/categories/Categories';
import Fournisseurs from './pages/fournisseurs/Fournisseurs';
import CodesBarre   from './pages/codes-barres/CodesBarre';
import Mouvements   from './pages/stocks/Mouvements';
import Scanner      from './pages/stocks/Scanner';
import Utilisateurs from './pages/utilisateurs/Utilisateurs';
import Impressions  from './pages/impressions/Impressions';
import Rapports     from './pages/rapports/Rapports';

// Route protégée : redirige vers /login si non connecté
function PrivateRoute({ children }) {
  const { utilisateur, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full spin"/>
        <p className="text-sm text-slate-400">Chargement...</p>
      </div>
    </div>
  );
  return utilisateur ? children : <Navigate to="/login" replace/>;
}

// Route publique : redirige vers /dashboard si déjà connecté
function PublicRoute({ children }) {
  const { utilisateur, loading } = useAuth();
  if (loading) return null;
  return !utilisateur ? children : <Navigate to="/dashboard" replace/>;
}

export default function App() {
  return (
    <Routes>
      {/* Page d'accueil publique */}
      <Route path="/" element={<Landing/>}/>

      {/* Connexion */}
      <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>

      {/* Pages protégées dans le Layout avec sidebar */}
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard/></Layout></PrivateRoute>}/>
      <Route path="/produits" element={<PrivateRoute><Layout><Produits/></Layout></PrivateRoute>}/>
      <Route path="/categories" element={<PrivateRoute><Layout><Categories/></Layout></PrivateRoute>}/>
      <Route path="/fournisseurs" element={<PrivateRoute><Layout><Fournisseurs/></Layout></PrivateRoute>}/>
      <Route path="/codes-barres" element={<PrivateRoute><Layout><CodesBarre/></Layout></PrivateRoute>}/>
      <Route path="/mouvements" element={<PrivateRoute><Layout><Mouvements/></Layout></PrivateRoute>}/>
      <Route path="/scans" element={<PrivateRoute><Layout><Scanner/></Layout></PrivateRoute>}/>
      <Route path="/utilisateurs" element={<PrivateRoute><Layout><Utilisateurs/></Layout></PrivateRoute>}/>
      <Route path="/impressions" element={<PrivateRoute><Layout><Impressions/></Layout></PrivateRoute>}/>
      <Route path="/rapports" element={<PrivateRoute><Layout><Rapports/></Layout></PrivateRoute>}/>

      {/* 404 → accueil */}
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}
