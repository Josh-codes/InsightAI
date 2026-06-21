import { useParams } from 'react-router-dom'
import Navbar from '../components/Common/Navbar'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import SchemaViewer from '../components/Dataset/SchemaViewer'
import QueryInput from '../components/Query/QueryInput'
import QueryResultPanel from '../components/Query/QueryResult'
import QueryHistory from '../components/Query/QueryHistory'
import ErrorBanner from '../components/Common/ErrorBanner'
import { useDataset } from '../hooks/useDatasets'
import { useRunQuery } from '../hooks/useQueryHistory'
import { formatBytes, formatDate } from '../utils/format'

export default function DatasetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const datasetId = Number(id)
  const { data: dataset, isLoading } = useDataset(datasetId)
  const { run, isLoading: querying, result, error } = useRunQuery(datasetId)

  if (isLoading) return <div className="min-h-screen bg-surface"><Navbar /><LoadingSpinner message="Loading dataset..." /></div>
  if (!dataset) return <div className="min-h-screen bg-surface"><Navbar /><ErrorBanner message="Dataset not found." /></div>

  const queryError = error
    ? ((error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Query failed.')
    : null

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white">{dataset.name}</h2>
          <p className="text-sm text-slate-400 mt-1">
            {dataset.row_count.toLocaleString()} rows · {Object.keys(dataset.schema).length} columns ·{' '}
            {formatBytes(dataset.file_size_bytes)} · Uploaded {formatDate(dataset.created_at)}
          </p>
        </div>

        {/* Schema */}
        <div className="bg-card border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Schema</h3>
          <SchemaViewer schema={dataset.schema} columnStats={dataset.column_stats} />
        </div>

        {/* Query Interface */}
        <div className="bg-card border border-slate-700 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Ask a Question</h3>
          <QueryInput onSubmit={run} isLoading={querying} />
          {querying && <LoadingSpinner message="Generating SQL and analyzing data..." />}
          {queryError && <ErrorBanner message={queryError} />}
          {result && !querying && <QueryResultPanel result={result} />}
        </div>

        {/* Query History */}
        <div className="bg-card border border-slate-700 rounded-xl p-5">
          <QueryHistory datasetId={datasetId} onSelect={run} />
        </div>
      </main>
    </div>
  )
}
