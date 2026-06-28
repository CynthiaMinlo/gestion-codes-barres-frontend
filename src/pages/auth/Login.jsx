import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  ScanBarcode, Eye, EyeOff, LogIn,
  Shield, Package, BarChart3, ArrowLeft,
} from 'lucide-react';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ login:'', mot_de_passe:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.login || !form.mot_de_passe) {
      toast.error('Remplissez tous les champs');
      return;
    }
    setLoading(true);
    try {
      await login(form.login, form.mot_de_passe);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiant ou mot de passe incorrect.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Panneau gauche ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
           style={{ background:'linear-gradient(145deg,#042C53 0%,#0C447C 55%,#185FA5 100%)' }}>

        {/* Décorations */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-white/5"/>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-white/5"/>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/15 p-2.5 rounded-xl">
            <ScanBarcode className="w-6 h-6 text-white"/>
          </div>
          <div>
            <p className="text-white font-bold text-xl">GestionCodes</p>
            <p className="text-white/40 text-xs">Système de codes-barres PME</p>
          </div>
        </div>

        {/* Texte accrocheur */}
        <div className="relative z-10">
          <h2 className="text-white text-4xl font-extrabold leading-tight mb-4"
              style={{letterSpacing:'-0.02em'}}>
            Gérez vos produits<br/>
            <span className="text-blue-200">intelligemment.</span>
          </h2>
          <p className="text-white/60 text-base mb-10 max-w-sm leading-relaxed">
            Générez, imprimez et gérez vos codes-barres pour toutes vos
            lignes de produits depuis une interface unique.
          </p>
          <div className="space-y-4">
            {[
              [ScanBarcode, 'Multi-formats',   'EAN-13, QR Code, Code 128, UPC, Code 39'],
              [Package,     'Gestion stocks',  'Alertes automatiques, historique complet'],
              [BarChart3,   'Rapports',        'Exports PDF, Excel et CSV en un clic'],
            ].map(([Icon, t, d]) => (
              <div key={t} className="flex items-start gap-4">
                <div className="bg-white/10 p-2 rounded-xl flex-shrink-0">
                  <Icon className="w-4 h-4 text-white/80"/>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t}</p>
                  <p className="text-white/50 text-xs">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/25 text-xs relative z-10">
          © 2026 GestionCodes — Tous droits réservés
        </p>
      </div>

      {/* ── Panneau droit (formulaire) ─────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <ScanBarcode className="w-6 h-6 text-primary-600"/>
            <p className="font-bold text-slate-800 text-lg">GestionCodes</p>
          </div>

          {/* Titre */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-800"
                style={{letterSpacing:'-0.02em'}}>
              Connexion
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Accédez à votre espace de gestion
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="label">Identifiant</label>
              <input type="text" className="input" placeholder="Votre identifiant"
                     value={form.login}
                     onChange={e => setForm({...form, login:e.target.value})}
                     autoFocus/>
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'}
                       className="input pr-10"
                       placeholder="••••••••"
                       value={form.mot_de_passe}
                       onChange={e => setForm({...form, mot_de_passe:e.target.value})}/>
                <button type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-slate-400 hover:text-slate-600 transition-colors">
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2
                               bg-primary-600 hover:bg-primary-700 text-white
                               font-bold py-3 rounded-xl transition-all
                               disabled:opacity-60 text-sm shadow-sm hover:shadow-md">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin"/>
                : <LogIn size={16}/>
              }
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            {/* ── Bouton retour à l'accueil ──────────────────── */}
            <Link to="/"
                  className="w-full flex items-center justify-center gap-2
                             bg-white hover:bg-slate-100 text-slate-600
                             font-medium py-3 rounded-xl transition-all
                             text-sm border border-slate-200">
              <ArrowLeft size={16}/>
              Retour à la page d'accueil
            </Link>
          </form>

          {/* Note sécurité */}
          <div className="flex items-center justify-center gap-2 mt-6 text-slate-400">
            <Shield size={13}/>
            <p className="text-xs">Connexion sécurisée — Accès restreint</p>
          </div>
        </div>
      </div>
    </div>
  );
}
