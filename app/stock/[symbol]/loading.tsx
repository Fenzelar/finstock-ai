export default function LoadingStockPage() {
  return (
    <div className="space-y-5 md:space-y-6 animate-pulse">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="skeleton h-6 w-32 rounded mb-2" />
          <div className="skeleton h-9 w-48 rounded" />
        </div>
        <div className="skeleton h-8 w-32 rounded-card" />
      </div>
      <div className="bg-surface border border-border rounded-card p-3 md:p-4">
        <div className="skeleton h-[280px] md:h-[420px] w-full rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 md:gap-3">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-card" />)}
      </div>
      <div className="skeleton h-40 rounded-card" />
    </div>
  );
}
