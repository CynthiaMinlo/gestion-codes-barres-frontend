import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Truck } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

const VIDE = { nom:'', contact:'', telephone:'', email:'', adresse:'' };

export default function Fournisseurs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(VIDE);
  const [saving, setSaving] = useState(false);

  const charger = async () => {
    try { const { data } = await api.get('/fournisseurs'); setItems(data.data || []); }
    catch { toast.error('Erreur'); } finally { setLoading(false); }
  };
  useEffect(() => { charger(); }, []);

  const ouvrir = (item = null) => {
    setEditing(item);
    setForm(item ? { nom:item.nom, contact:item.contact||'', telephone:item.telephone||'', email:item.email||'', adresse:item.adresse||'' } : VIDE);
    setModal(true);
  };

  const sauvegarder = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await api.put(`/fournisseurs/${editing.id}`, form); toast.success('Fournisseur modifié'); }
      else { await api.post('/fournisseurs', form); toast.success('Fournisseur créé'); }
      setModal(false); charger();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const supprimer = async (id) => {
    if (!confirm('Supprimer ce fournisseur ?')) return;
    try { await api.delete(`/fournisseurs/${id}`); toast.success('Supprimé'); charger(); }
    catch { toast.error('Erreur'); }
  };

  if (loading) return <Loader/>;

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <div><h2 className="page-title">Fournisseurs</h2><p className="text-sm text-slate-400 mt-0.5">{items.length} fournisseur{items.length>1?'s':''}</p></div>
        <button onClick={() => ouvrir()} className="btn-primary"><Plus size={16}/>Nouveau fournisseur</button>
      </div>
      <div className="table-container">
        {items.length === 0 ? (
          <EmptyState icon={Truck} titre="Aucun fournisseur" description="Ajoutez vos fournisseurs pour les associer à vos produits."
            action={<button onClick={() => ouvrir()} className="btn-primary"><Plus size={15}/>Ajouter un fournisseur</button>}/>
        ) : (
          <table className="table">
            <thead><tr><th className="th">Nom</th><th className="th">Contact</th><th className="th">Téléphone</th><th className="th">Email</th><th className="th">Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="td font-semibold text-slate-800">{item.nom}</td>
                  <td className="td text-slate-500">{item.contact||'—'}</td>
                  <td className="td text-slate-500">{item.telephone||'—'}</td>
                  <td className="td text-slate-500">{item.email||'—'}</td>
                  <td className="td">
                    <div className="flex gap-1">
                      <button onClick={() => ouvrir(item)} className="btn-ghost text-xs"><Edit2 size={14}/>Modifier</button>
                      <button onClick={() => supprimer(item.id)} className="btn-ghost text-red-500 hover:bg-red-50 text-xs"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} titre={editing ? 'Modifier le fournisseur' : 'Nouveau fournisseur'} size="lg">
        <form onSubmit={sauvegarder} className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="label">Nom *</label><input className="input" value={form.nom} onChange={e => setForm({...form,nom:e.target.value})} required/></div>
          <div><label className="label">Contact</label><input className="input" value={form.contact} onChange={e => setForm({...form,contact:e.target.value})}/></div>
          <div><label className="label">Téléphone</label><input className="input" value={form.telephone} onChange={e => setForm({...form,telephone:e.target.value})}/></div>
          <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></div>
          <div><label className="label">Adresse</label><input className="input" value={form.adresse} onChange={e => setForm({...form,adresse:e.target.value})}/></div>
          <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin"/> : <Plus size={15}/>}
              {editing ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
