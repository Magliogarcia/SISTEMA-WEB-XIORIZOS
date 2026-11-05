export default function ShopLoading() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center pt-28">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <span className="text-xs font-medium text-on-surface-variant">Cargando...</span>
      </div>
    </div>
  );
}

