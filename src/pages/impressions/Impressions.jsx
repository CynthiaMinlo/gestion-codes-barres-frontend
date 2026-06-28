import { useState, useEffect } from 'react';
import { Plus, Printer } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

export default function Impressions() {
  const [items, setItems] = useState([]);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState({ code_barre_id:'', nombre:'1', taille:'', couleur:'' });
  const [saving, setSaving]   = useState(false);

  const charger = async () => {
    // Chaque requête indépendante
    const [imp, c] = await Promise.allSettled([
      api.get('/impressions'),
      api.get('/codes-barres'),
    ]);

    if (imp.status === 'fulfilled') setItems(imp.value.data.data || []);
    if (c.status === 'fulfilled')   setCodes(c.value.data.data || []);

    setLoading(false);
  };

  useEffect(() => { charger(); }, []);

  const enregistrer = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/impressions', form);
      toast.success('Impression enregistrée');
      setModal(false); charger();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally { setSaving(false); }
  };

  if (loading) return <Loader/>;

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Impressions</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {items.length} impression{items.length>1?'s':''}
          </p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary">
          <Plus size={16}/>Nouvelle impression
        </button>
      </div>

      <div className="table-container">
        {items.length === 0 ? (
          <EmptyState icon={Printer} titre="Aucune impression"
            description="Enregistrez vos impressions d'étiquettes."
            action={<button onClick={() => setModal(true)} className="btn-primary">
              <Plus size={15}/>Nouvelle impression
            </button>}/>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="th">Produit</th>
                <th className="th">Code-barres</th>
                <th className="th">Nombre</th>
                <th className="th">Taille</th>
                <th className="th">Couleur</th>
                <th className="th">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="td font-semibold text-slate-800">
                    {item.produit?.nom || item.code_barre?.produit?.nom || '—'}
                  </td>
                  <td className="td">
                    <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {item.code_barre?.valeur || '—'}
                    </code>
                  </td>
                  <td className="td font-bold text-slate-800">{item.nombre}</td>
                  <td className="td text-slate-500">{item.taille || '—'}</td>
                  <td className="td text-slate-500">{item.couleur || '—'}</td>
                  <td className="td text-slate-500 text-xs">
                    {new Date(item.date_impression || item.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} titre="Nouvelle impression">
        <form onSubmit={enregistrer} className="space-y-4">
          <div>
            <label className="label">Code-barres *</label>
            <select className="select" value={form.code_barre_id}
                    onChange={e => setForm({...form,code_barre_id:e.target.value})} required>
              <option value="">— Choisir un code-barres —</option>
              {codes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.produit?.nom} — {c.format} ({c.valeur})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Nombre d'étiquettes *</label>
            <input className="input" type="number" min="1"
                   value={form.nombre}
                   onChange={e => setForm({...form,nombre:e.target.value})} required/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Taille</label>
              <input className="input" placeholder="ex: 5x3cm"
                     value={form.taille}
                     onChange={e => setForm({...form,taille:e.target.value})}/>
            </div>
            <div>
              <label className="label">Couleur</label>
              <input className="input" placeholder="ex: Noir/Blanc"
                     value={form.couleur}
                     onChange={e => setForm({...form,couleur:e.target.value})}/>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin"/>
                : <Printer size={15}/>
              }
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}