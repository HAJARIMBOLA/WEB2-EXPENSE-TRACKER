export default function StatsCard({ title, value, trend, chart }) {
  const up = (trend ?? 0) >= 0;
  return (
    <div className="p-4 rounded-2xl bg-[--color-light-card] dark:bg-[--color-dark-card] shadow">
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{Number(value || 0).toLocaleString()}</div>
      <div className={`text-xs mt-1 ${up ? "text-green-600" : "text-red-600"}`}>
        {up ? "▲" : "▼"} {Math.abs(trend || 0)}%
      </div>
      <div className="mt-3">{chart}</div>
    </div>
  );
}
