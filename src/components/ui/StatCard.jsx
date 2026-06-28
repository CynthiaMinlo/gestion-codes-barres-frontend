export default function StatCard({ titre, valeur, icon: Icon, couleur, sousTitre }) {
  const p = {
    blue:   { border:'border-l-primary-600', bg:'bg-primary-50',  text:'text-primary-600'  },
    red:    { border:'border-l-red-500',     bg:'bg-red-50',      text:'text-red-600'      },
    green:  { border:'border-l-emerald-500', bg:'bg-emerald-50',  text:'text-emerald-600'  },
    orange: { border:'border-l-orange-400',  bg:'bg-orange-50',   text:'text-orange-500'   },
    purple: { border:'border-l-violet-500',  bg:'bg-violet-50',   text:'text-violet-600'   },
  }[couleur] || { border:'border-l-primary-600', bg:'bg-primary-50', text:'text-primary-600' };
  return (
    <div className={`card p-5 border-l-4 ${p.border} hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{titre}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{valeur}</p>
          {sousTitre && <p className="text-xs text-slate-400 mt-1">{sousTitre}</p>}
        </div>
        <div className={`${p.bg} p-3 rounded-2xl`}><Icon className={`w-6 h-6 ${p.text}`}/></div>
      </div>
    </div>
  );
}
