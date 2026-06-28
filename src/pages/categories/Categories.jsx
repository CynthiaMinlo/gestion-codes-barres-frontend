import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

export default function Categories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom:'', description:'' });
  const [saving, setSaving] = useState(false);

  const charger = async () => {
    try { const { data } = await api.get('/categories'); setItems(data.data || []); }
    catch { toast.error('Erreur de chargement'); } finally { setLoading(false); }
  };
  useEffect(() => { charger(); }, []);

  const ouvrir = (item = null) => {
    setEditing(item);
    setForm(item ? { nom:item.nom, description:item.description||'' } : { nom:'', description:'' });
    setModal(true);
  };

  const sauvegarder = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await api.put(`/categories/${editing.id}`, form); toast.success('Catégorie modifiée'); }
      else { await api.post('/categories', form); toast.success('Catégorie créée'); }
      setModal(false); charger();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const supprimer = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Catégorie supprimée'); charger(); }
    catch { toast.error('Erreur lors de la suppression'); }
  };

  if (loading) return <Loader/>;

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <div><h2 className="page-title">Catégories</h2><p className="text-sm text-slate-400 mt-0.5">{items.length} catégorie{items.length>1?'s':''}</p></div>
        <button onClick={() => ouvrir()} className="btn-primary"><Plus size={16}/>Nouvelle catégorie</button>
      </div>
      <div className="table-container">
        {items.length === 0 ? (
          <EmptyState icon={Tag} titre="Aucune catégorie" description="Créez vos premières catégories de produits."
            action={<button onClick={() => ouvrir()} className="btn-primary"><Plus size={15}/>Créer une catégorie</button>}/>
        ) : (
          <table className="table">
            <thead><tr><th className="th">Nom</th><th className="th">Description</th><th className="th">Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="td font-semibold text-slate-800">{item.nom}</td>
                  <td className="td text-slate-500">{item.description||'—'}</td>
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
      <Modal isOpen={modal} onClose={() => setModal(false)} titre={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}>
        <form onSubmit={sauvegarder} className="space-y-4">
          <div><label className="label">Nom *</label><input className="input" placeholder="Alimentation" value={form.nom} onChange={e => setForm({...form,nom:e.target.value})} required/></div>
          <div><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={e => setForm({...form,description:e.target.value})}/></div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
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
