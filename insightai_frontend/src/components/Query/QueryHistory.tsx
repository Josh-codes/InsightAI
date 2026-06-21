import { useQueryHistory, useDeleteQueryHistory } from '../../hooks/useQueryHistory'
import { formatDate } from '../../utils/format'

interface HistoryItem {
  id: number
  natural_language: string
  created_at: string
}

interface Props {
  datasetId: number
  onSelect: (question: string) => void
}

export default function QueryHistory({ datasetId, onSelect }: Props) {
  const { data: history } = useQueryHistory(datasetId)
  const { mutate: deleteHistory } = useDeleteQueryHistory(datasetId)

  if (!history?.length) return null

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Recent Queries</h3>
      <div className="space-y-1">
        {(history as HistoryItem[]).slice(0, 10).map((q) => (
          <div key={q.id} className="flex items-center justify-between group rounded-lg px-3 py-2 hover:bg-card transition-colors">
            <button
              onClick={() => onSelect(q.natural_language)}
              className="flex-1 text-left text-sm text-slate-300 truncate hover:text-white"
            >
              {q.natural_language}
            </button>
            <div className="flex items-center gap-2 ml-2 shrink-0">
              <span className="text-xs text-slate-600">{formatDate(q.created_at)}</span>
              <button
                onClick={() => deleteHistory(q.id)}
                className="text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
