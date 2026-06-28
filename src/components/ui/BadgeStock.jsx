import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
export default function BadgeStock({ quantite, seuil }) {
  if (quantite <= 0) return <span className="badge-rupture"><XCircle size={10}/>Rupture</span>;
  if (quantite <= seuil) return <span className="badge-faible"><AlertTriangle size={10}/>Stock faible</span>;
  return <span className="badge-ok"><CheckCircle2 size={10}/>En stock</span>;
}
