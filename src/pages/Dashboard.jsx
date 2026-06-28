import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, AlertTriangle, Barcode,
  ScanLine, TrendingUp, Plus, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import api from '../api/axios';
import StatCard from '../components/ui/StatCard';
import BadgeStock from '../components/ui/BadgeStock';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';

export default function Dashboard() {
  const [produits,    setProduits]    = useState([]);
  const [codes,       setCodes]       = useState([]);
  const [mouvements,  setMouvements]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [erreurs,     setErreurs]     = useState({});

  useEffect(() => {
    const charger = async () => {
      // Chaque requête est indépendante — une erreur n'empêche pas les autres
      const [p, c, m] = await Promise.allSettled([
        api.get('/produits'),
        api.get('/codes-barres'),
        api.get('/mouvements'),
      ]);

      if (p.status === 'fulfilled') setProduits(p.value.data.data || []);
      else setErreurs(e => ({...e, produits: true}));

      if (c.status === 'fulfilled') setCodes(c.value.data.data || []);
      else setErreurs(e => ({...e, codes: true}));

      if (m.status === 'fulfilled') setMouvements(m.value.data.data || []);
      else setErreurs(e => ({...e, mouvements: true}));

      setLoading(false);
    };
    charger();
  }, []);

  const totalProduits  = produits.length;
  const enRupture      = produits.filter(p => p.quantite <= 0).length;
  const stockFaible    = produits.filter(p => p.quantite > 0 && p.quantite <= p.seuil_alerte).length;
  const totalCodes     = codes.length;
  const derniers       = [...produits].reverse().slice(0, 6);

  // Données graphique mouvements
  const mvtData = [
    { n:'Entrées',    v: mouvements.filter(m => m.type==='ENTREE').length,     color:'#198754' },
    { n:'Sorties',    v: mouvements.filter(m => m.type==='SORTIE').length,     color:'#dc3545' },
    { n:'Inventaire', v: mouvements.filter(m => m.type==='INVENTAIRE').length, color:'#185FA5' },
  ];

  // Données graphique statuts stock
  const stockData = [
    { n:'OK',      v: totalProduits - enRupture - stockFaible },
    { n:'Faible',  v: stockFaible },
    { n:'Rupture', v: enRupture },
  ];

  if (loading) return <Loader/>;

  return (
    <div className="space-y-6 fade-in">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Vue d'ensemble</h2>
          <p className="text-sm text-slate-400 mt-0.5">État actuel de votre inventaire</p>
        </div>
        <Link to="/produits" className="btn-primary">
          <Plus size={16}/>Nouveau produit
        </Link>
      </div>

      {/* Alerte rupture */}
      {enRupture > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200
                        rounded-xl px-4 py-3 text-red-700">
          <AlertTriangle size={16} className="flex-shrink-0"/>
          <p className="text-sm font-medium">
            {enRupture} produit{enRupture>1?'s':''} en rupture —{' '}
            <Link to="/mouvements" className="underline font-semibold">Réapprovisionner</Link>
          </p>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard titre="Total produits"    valeur={totalProduits} icon={Package}       couleur="blue"   sousTitre="dans la base"/>
        <StatCard titre="Ruptures de stock" valeur={enRupture}     icon={AlertTriangle} couleur="red"    sousTitre="quantité = 0"/>
        <StatCard titre="Stocks faibles"    valeur={stockFaible}   icon={TrendingUp}    couleur="orange" sousTitre="sous le seuil"/>
        <StatCard titre="Codes générés"     valeur={totalCodes}    icon={Barcode}       couleur="green"  sousTitre="total cumulé"/>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-700 mb-1">Mouvements de stock</p>
          <p className="text-xs text-slate-400 mb-4">Entrées, sorties et inventaires</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mvtData} margin={{top:0,right:0,left:-25,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
              <XAxis dataKey="n" tick={{fontSize:11,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:'10px',border:'none',boxShadow:'0 4px 20px rgba(0,0,0,0.12)',fontSize:'12px'}}/>
              <Bar dataKey="v" radius={[4,4,0,0]}>
                {mvtData.map((d,i) => <Cell key={i} fill={d.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-700 mb-1">Statuts des stocks</p>
          <p className="text-xs text-slate-400 mb-4">Répartition par état</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stockData} margin={{top:0,right:0,left:-25,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
              <XAxis dataKey="n" tick={{fontSize:11,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:'10px',border:'none',boxShadow:'0 4px 20px rgba(0,0,0,0.12)',fontSize:'12px'}}/>
              <Bar dataKey="v" radius={[4,4,0,0]}>
                {stockData.map((d,i) => (
                  <Cell key={i} fill={i===0?'#198754':i===1?'#fd7e14':'#dc3545'}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Derniers produits */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-700">Derniers produits</p>
          <Link to="/produits"
                className="flex items-center gap-1 text-xs text-primary-600
                           hover:text-primary-800 font-medium">
            Voir tout <ArrowRight size={13}/>
          </Link>
        </div>
        {derniers.length === 0 ? (
          <EmptyState icon={Package} titre="Aucun produit"
            description="Créez votre premier produit."
            action={<Link to="/produits" className="btn-primary"><Plus size={15}/>Créer</Link>}/>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Produit</th>
                  <th className="th">Référence</th>
                  <th className="th">Catégorie</th>
                  <th className="th">Prix</th>
                  <th className="th">Quantité</th>
                  <th className="th">État</th>
                </tr>
              </thead>
              <tbody>
                {derniers.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="td font-medium text-slate-800">{p.nom}</td>
                    <td className="td">
                      <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {p.reference}
                      </code>
                    </td>
                    <td className="td text-slate-500 text-xs">{p.categorie?.nom||'—'}</td>
                    <td className="td font-medium">{Number(p.prix).toLocaleString('fr-FR')} F</td>
                    <td className="td font-semibold">{p.quantite}</td>
                    <td className="td">
                      <BadgeStock quantite={p.quantite} seuil={p.seuil_alerte}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}