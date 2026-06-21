import { useNavigate } from 'react-router-dom'
import { useDeleteDataset } from '../../hooks/useDatasets'
import { formatBytes, formatDate } from '../../utils/format'

interface Dataset {
  id: number
  name: string
  row_count: number
  file_size_bytes: number
  created_at: string
}

export default function DatasetCard({ dataset }: { dataset: Dataset }) {
  const navigate = useNavigate()
  const { mutate: deleteDataset } = useDeleteDataset()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Delete "${dataset.name}"? This cannot be undone.`)) {
      deleteDataset(dataset.id)
    }
  }

  return (
    <div
      onClick={() => navigate(`/datasets/${dataset.id}`)}
      className="bg-card border border-slate-700 rounded-xl p-5 cursor-pointer hover:border-slate-500 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{dataset.name}</h3>
          <p className="text-sm text-slate-400 mt-1">
            {dataset.row_count.toLocaleString()} rows · {formatBytes(dataset.file_size_bytes)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{formatDate(dataset.created_at)}</p>
        </div>
        <button
          onClick={handleDelete}
          className="text-slate-500 hover:text-red-400 transition-colors text-sm px-2 py-1"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
