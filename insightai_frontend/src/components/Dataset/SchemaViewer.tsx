interface ColStats {
  null_count?: number
  min?: number
  max?: number
  mean?: number
  top_values?: string[]
  unique_count?: number
}

interface Props {
  schema: Record<string, string>
  columnStats: Record<string, ColStats>
}

export default function SchemaViewer({ schema, columnStats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Object.entries(schema).map(([col, type]) => {
        const stats = columnStats[col] ?? {}
        return (
          <div key={col} className="bg-surface rounded-lg p-3 border border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-sm text-white truncate">{col}</span>
              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded ml-2 shrink-0">{type}</span>
            </div>
            <div className="text-xs text-slate-500 space-y-0.5">
              {stats.null_count !== undefined && <p>Nulls: {stats.null_count}</p>}
              {stats.min !== undefined && <p>Min: {stats.min} · Max: {stats.max} · Avg: {stats.mean}</p>}
              {stats.top_values && <p>Top: {stats.top_values.slice(0, 3).join(', ')}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
