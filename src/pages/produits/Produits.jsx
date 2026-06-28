import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import BadgeStock from '../../components/ui/BadgeStock';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

const VIDE = { reference:'', nom:'', description:'', prix:'', quantite:'', seuil_alerte:'5', categorie_id:'', fournisseur_id:'' };

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(VIDE);
  const [saving, setSaving] = useState(false);

  const charger = async () => {
    try {
      const [p, c, f] = await Promise.all([api.get('/produits'), api.get('/categories'), api.get('/fournisseurs')]);
      setProduits(p.data.data || []);
      setCategories(c.data.data || []);
      setFournisseurs(f.data.data || []);
    } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { charger(); }, []);

  const ouvrir = (p = null) => {
    setEditing(p);
    setForm(p ? { reference:p.reference, nom:p.nom, description:p.description||'', prix:p.prix, quantite:p.quantite, seuil_alerte:p.seuil_alerte, categorie_id:p.categorie_id||'', fournisseur_id:p.fournisseur_id||'' } : VIDE);
    setModal(true);
  };

  const sauvegarder = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await api.put(`/produits/${editing.id}`, form); toast.success('Produit modifié'); }
      else { await api.post('/produits', form); toast.success('Produit créé'); }
      setModal(false); charger();
    } catch (err) {
      const errs = err.response?.data?.errors;
      if (errs) Object.values(errs).forEach(e => toast.error(e[0]));
      else toast.error(err.response?.data?.message || 'Erreur');
    } finally { setSaving(false); }
  };

  const supprimer = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try { await api.delete(`/produits/${id}`); toast.success('Produit supprimé'); charger(); }
    catch { toast.error('Erreur lors de la suppression'); }
  };

  const filtres = produits.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.reference.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader/>;

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Produits</h2>
          <p className="text-sm text-slate-400 mt-0.5">{produits.length} produit{produits.length>1?'s':''} au total</p>
        </div>
        <button onClick={() => ouvrir()} className="btn-primary"><Plus size={16}/>Nouveau produit</button>
      </div>

      <div className="card p-4 flex items-center gap-3">
        <Search size={16} className="text-slate-400 flex-shrink-0"/>
        <input className="flex-1 text-sm outline-none bg-transparent placeholder-slate-400"
          placeholder="Rechercher par nom ou référence..."
          value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      <div className="table-container">
        {filtres.length === 0 ? (
          <EmptyState icon={Package} titre="Aucun produit trouvé"
            description="Créez votre premier produit ou modifiez votre recherche."
            action={<button onClick={() => ouvrir()} className="btn-primary"><Plus size={15}/>Créer un produit</button>}/>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="th">Produit</th><th className="th">Référence</th>
                <th className="th">Catégorie</th><th className="th">Fournisseur</th>
                <th className="th">Prix</th><th className="th">Quantité</th>
                <th className="th">État</th><th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtres.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="td font-semibold text-slate-800">{p.nom}</td>
                  <td className="td"><code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{p.reference}</code></td>
                  <td className="td text-slate-500 text-xs">{p.categorie?.nom||'—'}</td>
                  <td className="td text-slate-500 text-xs">{p.fournisseur?.nom||'—'}</td>
                  <td className="td font-semibold">{Number(p.prix).toLocaleString('fr-FR')} F</td>
                  <td className="td font-bold text-slate-800">{p.quantite}</td>
                  <td className="td"><BadgeStock quantite={p.quantite} seuil={p.seuil_alerte}/></td>
                  <td className="td">
                    <div className="flex items-center gap-1">
                      <button onClick={() => ouvrir(p)} className="btn-ghost text-xs"><Edit2 size={14}/>Modifier</button>
                      <button onClick={() => supprimer(p.id)} className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} titre={editing ? 'Modifier le produit' : 'Nouveau produit'} size="lg">
        <form onSubmit={sauvegarder} className="grid grid-cols-2 gap-4">
          <div><label className="label">Référence *</label><input className="input" placeholder="ALI-001" value={form.reference} onChange={e => setForm({...form,reference:e.target.value})} required/></div>
          <div><label className="label">Nom *</label><input className="input" placeholder="Nom du produit" value={form.nom} onChange={e => setForm({...form,nom:e.target.value})} required/></div>
          <div className="col-span-2"><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={e => setForm({...form,description:e.target.value})}/></div>
          <div><label className="label">Prix (F) *</label><input className="input" type="number" min="0" step="0.01" value={form.prix} onChange={e => setForm({...form,prix:e.target.value})} required/></div>
          <div><label className="label">Quantité *</label><input className="input" type="number" min="0" value={form.quantite} onChange={e => setForm({...form,quantite:e.target.value})} required/></div>
          <div><label className="label">Seuil d'alerte</label><input className="input" type="number" min="0" value={form.seuil_alerte} onChange={e => setForm({...form,seuil_alerte:e.target.value})}/></div>
          <div><label className="label">Catégorie</label>
            <select className="select" value={form.categorie_id} onChange={e => setForm({...form,categorie_id:e.target.value})}>
              <option value="">— Aucune —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          <div className="col-span-2"><label className="label">Fournisseur</label>
            <select className="select" value={form.fournisseur_id} onChange={e => setForm({...form,fournisseur_id:e.target.value})}>
              <option value="">— Aucun —</option>
              {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </select>
          </div>
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
