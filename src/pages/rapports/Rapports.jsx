import { useState, useEffect } from 'react';
import {
  Package, AlertTriangle, Barcode,
  TrendingDown, ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../api/axios';
import Loader from '../../components/ui/Loader';
import BadgeStock from '../../components/ui/BadgeStock';

const COLORS = ['#185FA5','#198754','#fd7e14','#dc3545','#534AB7'];

export default function Rapports() {
  const [produits,    setProduits]    = useState([]);
  const [codes,       setCodes]       = useState([]);
  const [mouvements,  setMouvements]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const charger = async () => {
      // Promise.allSettled — une erreur n'empêche pas les autres
      const [p, c, m] = await Promise.allSettled([
        api.get('/produits'),
        api.get('/codes-barres'),
        api.get('/mouvements'),
      ]);

      if (p.status === 'fulfilled') setProduits(p.value.data.data || []);
      if (c.status === 'fulfilled') setCodes(c.value.data.data || []);
      if (m.status === 'fulfilled') setMouvements(m.value.data.data || []);

      setLoading(false);
    };
    charger();
  }, []);

  const ruptures = produits.filter(p => p.quantite <= 0);
  const faibles  = produits.filter(p => p.quantite > 0 && p.quantite <= p.seuil_alerte);

  // Produits par catégorie
  const catData = Object.entries(
    produits.reduce((acc, p) => {
      const cat = p.categorie?.nom || 'Sans catégorie';
      acc[cat]  = (acc[cat] || 0) + 1;
      return acc;
    }, {})
  ).map(([nom, nb]) => ({ nom, nb })).slice(0, 8);

  // Codes par format
  const formatData = Object.entries(
    codes.reduce((acc, c) => {
      acc[c.format] = (acc[c.format] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Mouvements par type
  const mvtData = [
    { type:'Entrées',    nb: mouvements.filter(m => m.type==='ENTREE').length     },
    { type:'Sorties',    nb: mouvements.filter(m => m.type==='SORTIE').length     },
    { type:'Inventaire', nb: mouvements.filter(m => m.type==='INVENTAIRE').length },
  ];

  if (loading) return <Loader/>;

  return (
    <div className="space-y-6 fade-in">

      <div>
        <h2 className="page-title">Rapports & Statistiques</h2>
        <p className="text-sm text-slate-400 mt-0.5">Vue globale de votre inventaire</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total produits', val:produits.length,  icon:Package,       bg:'bg-blue-50',   text:'text-blue-600'   },
          { label:'En rupture',     val:ruptures.length,  icon:AlertTriangle, bg:'bg-red-50',    text:'text-red-600'    },
          { label:'Stock faible',   val:faibles.length,   icon:TrendingDown,  bg:'bg-orange-50', text:'text-orange-600' },
          { label:'Codes générés',  val:codes.length,     icon:Barcode,       bg:'bg-emerald-50',text:'text-emerald-600'},
        ].map(({ label, val, icon: Icon, bg, text }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`${bg} p-3 rounded-2xl`}>
              <Icon className={`w-6 h-6 ${text}`}/>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-slate-800">{val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Produits par catégorie */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Produits par catégorie</p>
          {catData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Aucune donnée</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={catData} margin={{top:0,right:0,left:-25,bottom:20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="nom" tick={{fontSize:9,fill:'#94A3B8'}} angle={-30} textAnchor="end" axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{borderRadius:'10px',border:'none',fontSize:'12px'}}/>
                <Bar dataKey="nb" fill="#185FA5" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Formats codes-barres */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Formats de codes-barres</p>
          {formatData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Aucun code généré</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={formatData} cx="50%" cy="50%" outerRadius={75}
                     dataKey="value" label={({name,value}) => `${name}:${value}`}>
                  {formatData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
                <Legend iconSize={10} iconType="circle" wrapperStyle={{fontSize:'11px'}}/>
                <Tooltip contentStyle={{borderRadius:'10px',border:'none',fontSize:'12px'}}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Mouvements de stock */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Mouvements de stock</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mvtData} margin={{top:0,right:0,left:-25,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
              <XAxis dataKey="type" tick={{fontSize:11,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:'10px',border:'none',fontSize:'12px'}}/>
              <Bar dataKey="nb" radius={[4,4,0,0]}>
                {mvtData.map((d,i) => (
                  <Cell key={i} fill={i===0?'#198754':i===1?'#dc3545':'#185FA5'}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Produits en alerte */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={15} className="text-red-500"/>
            Alertes stock
          </p>
          {[...ruptures, ...faibles].length === 0 ? (
            <div className="text-center py-8">
              <p className="text-emerald-600 font-semibold text-sm">✓ Tous les stocks sont OK !</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {[...ruptures, ...faibles].map(p => (
                <div key={p.id}
                     className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{p.nom}</p>
                    <p className="text-xs text-slate-400">{p.reference}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-700">
                      {p.quantite}/{p.seuil_alerte}
                    </span>
                    <BadgeStock quantite={p.quantite} seuil={p.seuil_alerte}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top 5 mouvements récents */}
      {mouvements.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">Derniers mouvements de stock</p>
          </div>
          <div className="divide-y divide-slate-50">
            {mouvements.slice(0, 5).map(m => (
              <div key={m.id} className="flex items-center gap-4 px-6 py-3">
                <div className={`p-2 rounded-xl ${
                  m.type==='ENTREE' ? 'bg-emerald-50' :
                  m.type==='SORTIE' ? 'bg-red-50' : 'bg-blue-50'
                }`}>
                  {m.type==='ENTREE'
                    ? <ArrowUpCircle size={16} className="text-emerald-600"/>
                    : m.type==='SORTIE'
                      ? <ArrowDownCircle size={16} className="text-red-600"/>
                      : <Package size={16} className="text-blue-600"/>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {m.produit?.nom || '—'}
                  </p>
                  <p className="text-xs text-slate-400">{m.motif || m.type}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    m.type==='ENTREE' ? 'text-emerald-600' :
                    m.type==='SORTIE' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {m.type==='ENTREE' ? '+' : m.type==='SORTIE' ? '-' : ''}{m.quantite}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(m.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}