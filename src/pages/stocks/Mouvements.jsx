import { useState, useEffect } from 'react';
import { Plus, ArrowUpCircle, ArrowDownCircle, RotateCcw, ArrowLeftRight } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

export default function Mouvements() {
  const [mouvements, setMouvements] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type:'ENTREE', quantite:'', motif:'', produit_id:'' });
  const [saving, setSaving] = useState(false);

  const charger = async () => {
    try {
      const [m, p] = await Promise.all([api.get('/mouvements'), api.get('/produits')]);
      setMouvements(m.data.data || []);
      setProduits(p.data.data || []);
    } catch { toast.error('Erreur'); } finally { setLoading(false); }
  };
  useEffect(() => { charger(); }, []);

  const enregistrer = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await api.post('/mouvements', form);
      const msg = res.data.data?.message || 'Mouvement enregistré';
      if (res.data.data?.alerte_stock) toast.error('⚠️ ' + msg);
      else toast.success(msg);
      setModal(false); charger();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const typeIcon = (t) => {
    if (t === 'ENTREE') return <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><ArrowUpCircle size={14}/>Entrée</span>;
    if (t === 'SORTIE') return <span className="flex items-center gap-1 text-red-600 text-xs font-bold"><ArrowDownCircle size={14}/>Sortie</span>;
    return <span className="flex items-center gap-1 text-blue-600 text-xs font-bold"><RotateCcw size={14}/>Inventaire</span>;
  };

  if (loading) return <Loader/>;

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <div><h2 className="page-title">Mouvements de stock</h2><p className="text-sm text-slate-400 mt-0.5">{mouvements.length} mouvement{mouvements.length>1?'s':''}</p></div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16}/>Nouveau mouvement</button>
      </div>

      {/* Résumé rapide */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Entrées', type:'ENTREE', color:'emerald', icon:ArrowUpCircle },
          { label:'Sorties', type:'SORTIE', color:'red', icon:ArrowDownCircle },
          { label:'Inventaires', type:'INVENTAIRE', color:'blue', icon:RotateCcw },
        ].map(({ label, type, color, icon: Icon }) => (
          <div key={type} className={`card p-4 flex items-center gap-3 border-l-4 border-l-${color}-500`}>
            <div className={`bg-${color}-50 p-2.5 rounded-xl`}><Icon className={`w-5 h-5 text-${color}-600`}/></div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-slate-800">{mouvements.filter(m => m.type === type).length}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-container">
        {mouvements.length === 0 ? (
          <EmptyState icon={ArrowLeftRight} titre="Aucun mouvement" description="Enregistrez les entrées et sorties de vos produits."
            action={<button onClick={() => setModal(true)} className="btn-primary"><Plus size={15}/>Nouveau mouvement</button>}/>
        ) : (
          <table className="table">
            <thead><tr><th className="th">Type</th><th className="th">Produit</th><th className="th">Quantité</th><th className="th">Motif</th><th className="th">Date</th></tr></thead>
            <tbody>
              {mouvements.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="td">{typeIcon(m.type)}</td>
                  <td className="td font-semibold text-slate-800">{m.produit?.nom||'—'}</td>
                  <td className="td">
                    <span className={`font-bold text-sm ${m.type==='ENTREE'?'text-emerald-600':m.type==='SORTIE'?'text-red-600':'text-blue-600'}`}>
                      {m.type==='ENTREE'?'+':m.type==='SORTIE'?'-':''}{m.quantite}
                    </span>
                  </td>
                  <td className="td text-slate-500">{m.motif||'—'}</td>
                  <td className="td text-slate-500 text-xs">{new Date(m.date_mouvement||m.created_at).toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} titre="Nouveau mouvement de stock">
        <form onSubmit={enregistrer} className="space-y-4">
          <div>
            <label className="label">Type de mouvement *</label>
            <div className="grid grid-cols-3 gap-2">
              {['ENTREE','SORTIE','INVENTAIRE'].map(t => (
                <button type="button" key={t}
                  onClick={() => setForm({...form,type:t})}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    form.type===t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'
                  }`}>
                  {t === 'ENTREE' ? '↑ Entrée' : t === 'SORTIE' ? '↓ Sortie' : '↺ Inventaire'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Produit *</label>
            <select className="select" value={form.produit_id} onChange={e => setForm({...form,produit_id:e.target.value})} required>
              <option value="">— Choisir un produit —</option>
              {produits.map(p => <option key={p.id} value={p.id}>{p.nom} (stock: {p.quantite})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Quantité *</label>
            <input className="input" type="number" min="1" placeholder="0" value={form.quantite} onChange={e => setForm({...form,quantite:e.target.value})} required/>
          </div>
          <div>
            <label className="label">Motif</label>
            <input className="input" placeholder="Livraison fournisseur, vente, etc." value={form.motif} onChange={e => setForm({...form,motif:e.target.value})}/>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin"/> : <Plus size={15}/>}
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
