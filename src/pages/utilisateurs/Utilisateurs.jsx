import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, Shield } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

const VIDE = { nom:'', prenom:'', login:'', mot_de_passe:'', role_id:'', actif:true };

export default function Utilisateurs() {
  const [items, setItems] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(VIDE);
  const [saving, setSaving] = useState(false);

  const charger = async () => {
    try {
      const [u, r] = await Promise.all([api.get('/utilisateurs'), api.get('/roles')]);
      setItems(u.data.data || []);
      setRoles(r.data.data || []);
    } catch { toast.error('Erreur'); } finally { setLoading(false); }
  };
  useEffect(() => { charger(); }, []);

  const ouvrir = (item = null) => {
    setEditing(item);
    setForm(item ? { nom:item.nom, prenom:item.prenom||'', login:item.login, mot_de_passe:'', role_id:item.role_id||'', actif:item.actif } : VIDE);
    setModal(true);
  };

  const sauvegarder = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {...form};
      if (!payload.mot_de_passe) delete payload.mot_de_passe;
      if (editing) { await api.put(`/utilisateurs/${editing.id}`, payload); toast.success('Utilisateur modifié'); }
      else { await api.post('/utilisateurs', form); toast.success('Utilisateur créé'); }
      setModal(false); charger();
    } catch (err) {
      const errs = err.response?.data?.errors;
      if (errs) Object.values(errs).forEach(e => toast.error(e[0]));
      else toast.error(err.response?.data?.message || 'Erreur');
    } finally { setSaving(false); }
  };

  const supprimer = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try { await api.delete(`/utilisateurs/${id}`); toast.success('Supprimé'); charger(); }
    catch { toast.error('Erreur'); }
  };

  const roleBadge = (r) => {
    const colors = { administrateur:'bg-red-100 text-red-800', gestionnaire:'bg-blue-100 text-blue-800', operateur:'bg-slate-100 text-slate-700' };
    const name = r?.nom?.toLowerCase() || '';
    return <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${colors[name]||'bg-slate-100 text-slate-700'}`}>{r?.nom||'—'}</span>;
  };

  if (loading) return <Loader/>;

  return (
    <div className="space-y-5 fade-in">
      <div className="page-header">
        <div><h2 className="page-title">Utilisateurs</h2><p className="text-sm text-slate-400 mt-0.5">{items.length} utilisateur{items.length>1?'s':''}</p></div>
        <button onClick={() => ouvrir()} className="btn-primary"><Plus size={16}/>Nouvel utilisateur</button>
      </div>
      <div className="table-container">
        {items.length === 0 ? (
          <EmptyState icon={Users} titre="Aucun utilisateur" description="Créez les comptes utilisateurs de votre équipe."
            action={<button onClick={() => ouvrir()} className="btn-primary"><Plus size={15}/>Créer un utilisateur</button>}/>
        ) : (
          <table className="table">
            <thead><tr><th className="th">Nom</th><th className="th">Login</th><th className="th">Rôle</th><th className="th">Statut</th><th className="th">Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                        {item.nom?.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{item.nom} {item.prenom}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td"><code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{item.login}</code></td>
                  <td className="td">{roleBadge(item.role)}</td>
                  <td className="td">
                    {item.actif
                      ? <span className="badge-ok"><Shield size={10}/>Actif</span>
                      : <span className="badge-rupture">Inactif</span>}
                  </td>
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
      <Modal isOpen={modal} onClose={() => setModal(false)} titre={editing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'} size="lg">
        <form onSubmit={sauvegarder} className="grid grid-cols-2 gap-4">
          <div><label className="label">Nom *</label><input className="input" value={form.nom} onChange={e => setForm({...form,nom:e.target.value})} required/></div>
          <div><label className="label">Prénom</label><input className="input" value={form.prenom} onChange={e => setForm({...form,prenom:e.target.value})}/></div>
          <div><label className="label">Login *</label><input className="input" value={form.login} onChange={e => setForm({...form,login:e.target.value})} required/></div>
          <div><label className="label">{editing ? 'Nouveau mot de passe' : 'Mot de passe *'}</label>
            <input className="input" type="password" placeholder={editing ? '(laisser vide = inchangé)' : ''}
              value={form.mot_de_passe} onChange={e => setForm({...form,mot_de_passe:e.target.value})} required={!editing}/>
          </div>
          <div><label className="label">Rôle *</label>
            <select className="select" value={form.role_id} onChange={e => setForm({...form,role_id:e.target.value})} required>
              <option value="">— Choisir un rôle —</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.actif} onChange={e => setForm({...form,actif:e.target.checked})} className="w-4 h-4 rounded accent-primary-600"/>
              <span className="text-sm font-medium text-slate-700">Compte actif</span>
            </label>
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
