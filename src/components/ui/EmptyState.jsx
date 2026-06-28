export default function EmptyState({ icon: Icon, titre, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-slate-100 p-5 rounded-2xl mb-4"><Icon className="w-10 h-10 text-slate-400"/></div>
      <h3 className="text-base font-semibold text-slate-700">{titre}</h3>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
