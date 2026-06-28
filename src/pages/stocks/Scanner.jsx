import { useState } from 'react';
import { ScanLine, Search, CheckCircle2, Package } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import BadgeStock from '../../components/ui/BadgeStock';

export default function Scanner() {
  const [valeur, setValeur] = useState('');
  const [source, setSource] = useState('USB');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanner = async (e) => {
    e.preventDefault();
    if (!valeur.trim()) { toast.error('Entrez une valeur à scanner'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/scans', { valeur, source });
      setResult(data.data);
      toast.success('Produit trouvé !');
    } catch (err) {
      setResult(null);
      toast.error(err.response?.data?.message || 'Code non reconnu');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 fade-in max-w-2xl">
      <div>
        <h2 className="page-title">Scanner un produit</h2>
        <p className="text-sm text-slate-400 mt-0.5">Scannez ou entrez manuellement une valeur de code-barres</p>
      </div>

      <div className="card p-6 space-y-5">
        <div>
          <label className="label">Source du scan</label>
          <div className="grid grid-cols-3 gap-2">
            {['USB','WEBCAM','SMARTPHONE'].map(s => (
              <button type="button" key={s}
                onClick={() => setSource(s)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  source===s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'
                }`}>
                {s === 'USB' ? '🔌 Scanner USB' : s === 'WEBCAM' ? '📷 Webcam' : '📱 Smartphone'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={scanner} className="space-y-4">
          <div>
            <label className="label">Valeur du code-barres *</label>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Scannez ou tapez la valeur..."
                value={valeur} onChange={e => setValeur(e.target.value)} autoFocus/>
              <button type="submit" disabled={loading} className="btn-primary px-6">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin"/> : <Search size={16}/>}
                Chercher
              </button>
            </div>
          </div>
        </form>
      </div>

      {result && (
        <div className="card p-6 fade-in">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <div className="bg-emerald-50 p-2.5 rounded-xl"><CheckCircle2 className="w-6 h-6 text-emerald-600"/></div>
            <div>
              <p className="font-bold text-slate-800">Produit trouvé</p>
              <p className="text-xs text-slate-400">Informations détaillées du produit scanné</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Nom', result.produit?.nom],
              ['Référence', result.produit?.reference],
              ['Prix', `${Number(result.produit?.prix||0).toLocaleString('fr-FR')} F`],
              ['Quantité', result.produit?.quantite],
              ['Catégorie', result.produit?.categorie||'—'],
              ['Fournisseur', result.produit?.fournisseur||'—'],
            ].map(([label, val]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-800">{val||'—'}</p>
              </div>
            ))}
            <div className="col-span-2 bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">État du stock</p>
              <BadgeStock quantite={result.produit?.quantite||0} seuil={5}/>
              {result.produit?.en_rupture && (
                <p className="text-xs text-red-600 mt-1 font-medium">⚠️ Stock critique — réapprovisionnement recommandé</p>
              )}
            </div>
          </div>
          <button onClick={() => { setResult(null); setValeur(''); }} className="btn-secondary mt-4 w-full justify-center">
            <ScanLine size={15}/>Nouveau scan
          </button>
        </div>
      )}
    </div>
  );
}
