export default function Loader({ texte = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full spin"/>
      <p className="text-sm text-slate-400">{texte}</p>
    </div>
  );
}
