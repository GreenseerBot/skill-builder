const colors: Record<string, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  PATCH: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function MethodBadge({ method }: { method: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${colors[method] || 'bg-gray-500/20 text-gray-400'}`}>
      {method}
    </span>
  );
}
