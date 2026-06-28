import { useState, useEffect } from 'react';
import { Plus, Trash2, Barcode, Download, Eye, Printer, X, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

const FORMATS = ['EAN13','CODE128','QRCODE','UPC','CODE39'];

export default function CodesBarre() {
  const [codes,     setCodes]     = useState([]);
  const [produits,  setProduits]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [preview,   setPreview]   = useState(null);
  const [form,      setForm]      = useState({ produit_id:'', format:'CODE128', contenu_qr:'' });
  const [saving,    setSaving]    = useState(false);
  const [erreur,    setErreur]    = useState(null);

  const charger = async () => {
    setLoading(true);
    setErreur(null);

    const [c, p] = await Promise.allSettled([
      api.get('/codes-barres'),
      api.get('/produits'),
    ]);

    if (c.status === 'fulfilled') {
      setCodes(c.value.data.data || []);
    } else {
      setErreur('Impossible de charger les codes-barres : ' + (c.reason?.response?.data?.detail || c.reason?.message || 'Erreur serveur'));
    }

    if (p.status === 'fulfilled') {
      setProduits(p.value.data.data || []);
    }

    setLoading(false);
  };

  useEffect(() => { charger(); }, []);

  const generer = async (e) => {
    e.preventDefault();
    if (!form.produit_id) { toast.error('Choisissez un produit'); return; }
    setSaving(true);
    try {
      await api.post('/codes-barres', form);
      toast.success('Code-barres généré !');
      setModal(false);
      setForm({ produit_id:'', format:'CODE128', contenu_qr:'' });
      charger();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la génération');
    } finally { setSaving(false); }
  };

  const supprimer = async (id) => {
    if (!confirm('Supprimer ce code-barres ?')) return;
    try {
      await api.delete(`/codes-barres/${id}`);
      toast.success('Code-barres supprimé');
      charger();
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  // Impression unitaire
  const imprimer = (code) => {
    const w = window.open('', '_blank', 'width=420,height=520');
    w.document.write(`<!DOCTYPE html><html><head>
      <title>Étiquette — ${code.produit?.nom||''}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,sans-serif;background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh}
        .etiq{width:7cm;padding:10px;border:1px solid #ccc;border-radius:8px;text-align:center}
        .etiq img{max-width:100%;height:auto;display:block;margin:0 auto 8px}
        .nom{font-size:12px;font-weight:bold;color:#1E293B;margin-bottom:3px}
        .ref{font-size:10px;color:#64748B;margin-bottom:3px}
        .prix{font-size:14px;font-weight:bold;color:#185FA5}
        .fmt{font-size:9px;color:#94A3B8;margin-top:4px}
        @media print{body{margin:0}.etiq{border-color:#999}}
      </style></head><body>
      <div class="etiq">
        ${code.url_image ? `<img src="${code.url_image}" alt="code"/>` : '<div style="height:80px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:10px;color:#94A3B8;border-radius:6px">Image non disponible</div>'}
        <div class="nom">${code.produit?.nom||'—'}</div>
        <div class="ref">Réf : ${code.valeur}</div>
        <div class="prix">${Number(code.produit?.prix||0).toLocaleString('fr-FR')} F CFA</div>
        <div class="fmt">${code.format}</div>
      </div>
      <script>window.onload=()=>{window.print();window.close()}<\/script>
    </body></html>`);
    w.document.close();
  };

  // Impression en série
  const imprimerTout = () => {
    const etiquettes = codes.map(code => `
      <div class="etiq">
        ${code.url_image ? `<img src="${code.url_image}" alt="code"/>` : '<div style="height:60px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:9px;color:#94A3B8;border-radius:4px">Image non disponible</div>'}
        <div class="nom">${code.produit?.nom||'—'}</div>
        <div class="ref">Réf : ${code.valeur}</div>
        <div class="prix">${Number(code.produit?.prix||0).toLocaleString('fr-FR')} F</div>
        <div class="fmt">${code.format}</div>
      </div>`).join('');

    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(`<!DOCTYPE html><html><head>
      <title>Impression en série</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,sans-serif;background:#fff;padding:10px}
        .grille{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-start}
        .etiq{width:6.5cm;padding:8px;border:0.5px solid #ccc;border-radius:6px;text-align:center;page-break-inside:avoid}
        .etiq img{max-width:100%;height:auto;display:block;margin:0 auto 6px}
        .nom{font-size:11px;font-weight:bold;color:#1E293B;margin-bottom:2px}
        .ref{font-size:9px;color:#64748B;margin-bottom:2px}
        .prix{font-size:12px;font-weight:bold;color:#185FA5}
        .fmt{font-size:8px;color:#94A3B8;margin-top:3px}
        @media print{body{padding:0}}
      </style></head><body>
      <div class="grille">${etiquettes}</div>
      <script>window.onload=()=>window.print()<\/script>
    </body></html>`);
    w.document.close();
  };

  const badgeFormat = (f) => {
    const colors = {
      EAN13:'bg-blue-100 text-blue-800',
      CODE128:'bg-purple-100 text-purple-800',
      QRCODE:'bg-green-100 text-green-800',
      UPC:'bg-orange-100 text-orange-800',
      CODE39:'bg-slate-100 text-slate-700',
    };
    return (
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors[f]||'bg-slate-100'}`}>
        {f}
      </span>
    );
  };

  if (loading) return <Loader texte="Chargement des codes-barres..."/>;

  return (
    <div className="space-y-5 fade-in">

      {/* En-tête */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Codes-barres</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {codes.length} code{codes.length > 1 ? 's' : ''} généré{codes.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={charger} className="btn-secondary">
            <RefreshCw size={15}/>Actualiser
          </button>
          {codes.length > 0 && (
            <button onClick={imprimerTout} className="btn-secondary">
              <Printer size={16}/>Imprimer tout
            </button>
          )}
          <button onClick={() => setModal(true)} className="btn-primary">
            <Plus size={16}/>Générer un code
          </button>
        </div>
      </div>

      {/* Affiche l'erreur si présente */}
      {erreur && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          ⚠️ {erreur}
          <button onClick={charger} className="ml-3 underline font-semibold">Réessayer</button>
        </div>
      )}

      {/* Tableau */}
      <div className="table-container">
        {codes.length === 0 && !erreur ? (
          <EmptyState icon={Barcode} titre="Aucun code-barres"
            description="Générez votre premier code-barres pour un produit."
            action={
              <button onClick={() => setModal(true)} className="btn-primary">
                <Plus size={15}/>Générer un code
              </button>
            }/>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="th">Aperçu</th>
                <th className="th">Produit</th>
                <th className="th">Format</th>
                <th className="th">Valeur</th>
                <th className="th">Date</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">

                  {/* Miniature */}
                  <td className="td">
                    {c.url_image ? (
                      <img
                        src={c.url_image}
                        alt={c.format}
                        className="h-10 w-auto object-contain cursor-pointer
                                   hover:scale-150 transition-transform rounded"
                        onClick={() => setPreview(c)}
                        onError={(e) => { e.target.style.display='none'; }}
                      />
                    ) : (
                      <div className="h-10 w-20 bg-slate-100 rounded flex items-center
                                      justify-center text-slate-400 text-xs">
                        <Barcode size={14}/>
                      </div>
                    )}
                  </td>

                  <td className="td font-semibold text-slate-800">
                    {c.produit?.nom || '—'}
                  </td>
                  <td className="td">{badgeFormat(c.format)}</td>
                  <td className="td">
                    <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {c.valeur}
                    </code>
                  </td>
                  <td className="td text-slate-500 text-xs">
                    {new Date(c.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="td">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button onClick={() => setPreview(c)}
                              className="btn-ghost text-xs">
                        <Eye size={13}/>Voir
                      </button>
                      <button onClick={() => imprimer(c)}
                              className="btn-ghost text-xs text-blue-600 hover:bg-blue-50">
                        <Printer size={13}/>Imprimer
                      </button>
                      {c.url_image && (
                        <a href={c.url_image}
                           download={`${c.format}_${c.valeur}.png`}
                           className="btn-ghost text-xs">
                          <Download size={13}/>PNG
                        </a>
                      )}
                      <button onClick={() => supprimer(c.id)}
                              className="btn-ghost text-xs text-red-500 hover:bg-red-50">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal génération ──────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{backgroundColor:'rgba(15,23,42,0.6)'}}
             onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg fade-in"
               onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-800">Générer un code-barres</h3>
              <button onClick={() => setModal(false)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={17} className="text-slate-500"/>
              </button>
            </div>

            <form onSubmit={generer} className="px-6 py-5 space-y-4">

              {/* Produit */}
              <div>
                <label className="label">Produit *</label>
                <select className="select" value={form.produit_id}
                        onChange={e => setForm({...form,produit_id:e.target.value})} required>
                  <option value="">— Choisir un produit —</option>
                  {produits.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nom} ({p.reference})
                    </option>
                  ))}
                </select>
              </div>

              {/* Format */}
              <div>
                <label className="label">Format *</label>
                <div className="grid grid-cols-5 gap-2">
                  {FORMATS.map(f => (
                    <button type="button" key={f}
                            onClick={() => setForm({...form,format:f})}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              form.format === f
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'
                            }`}>
                      {f}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {form.format === 'EAN13'   && '📦 Commerce de détail et supermarchés'}
                  {form.format === 'CODE128' && '🏭 Logistique, entrepôts, polyvalent'}
                  {form.format === 'QRCODE'  && '📱 Données enrichies, scan smartphone'}
                  {form.format === 'UPC'     && '🛒 Grande distribution américaine'}
                  {form.format === 'CODE39'  && '🏥 Industrie, santé, alphanumérique'}
                </p>
              </div>

              {/* Contenu QR enrichi */}
              {form.format === 'QRCODE' && (
                <div>
                  <label className="label">Contenu QR enrichi (optionnel)</label>
                  <textarea className="input" rows={3}
                    placeholder="URL, texte libre, JSON... Laissez vide pour encoder la référence produit."
                    value={form.contenu_qr}
                    onChange={e => setForm({...form,contenu_qr:e.target.value})}/>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin"/>
                    : <Barcode size={15}/>
                  }
                  Générer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal prévisualisation ────────────────────────────── */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{backgroundColor:'rgba(15,23,42,0.6)'}}
             onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md fade-in"
               onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-800">
                Aperçu — {preview.format}
              </h3>
              <button onClick={() => setPreview(null)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={17} className="text-slate-500"/>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* Image */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6
                              flex items-center justify-center min-h-36">
                {preview.url_image ? (
                  <img src={preview.url_image} alt="Code-barres"
                       className="max-w-full max-h-52 object-contain"/>
                ) : (
                  <div className="text-center text-slate-400">
                    <Barcode size={40} className="mx-auto mb-2"/>
                    <p className="text-sm font-medium">Image non générée</p>
                    <p className="text-xs mt-1">Supprimez et régénérez ce code</p>
                  </div>
                )}
              </div>

              {/* Infos */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Produit',   preview.produit?.nom],
                  ['Référence', preview.valeur],
                  ['Format',    preview.format],
                  ['Prix',      `${Number(preview.produit?.prix||0).toLocaleString('fr-FR')} F CFA`],
                  ['Quantité',  preview.produit?.quantite ?? '—'],
                  ['Date',      new Date(preview.created_at).toLocaleDateString('fr-FR')],
                ].map(([label, val]) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-sm font-bold text-slate-800">{val || '—'}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                {preview.url_image && (
                  <a href={preview.url_image}
                     download={`${preview.format}_${preview.valeur}.png`}
                     className="btn-secondary flex-1 justify-center">
                    <Download size={15}/>Télécharger
                  </a>
                )}
                <button onClick={() => imprimer(preview)}
                        className="btn-primary flex-1 justify-center">
                  <Printer size={15}/>Imprimer étiquette
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
