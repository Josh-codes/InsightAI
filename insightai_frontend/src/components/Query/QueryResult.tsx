import type { QueryResult } from '../../hooks/useQueryHistory'
import BarChartView from './BarChartView'
import LineChartView from './LineChartView'
import TableView from './TableView'
import ErrorBoundary from '../Common/ErrorBoundary'

export default function QueryResultPanel({ result }: { result: QueryResult }) {
  const { generated_sql, result_data, chart_type, insight, cached, execution_time_ms } = result

  return (
    <div className="space-y-4">
      <details className="bg-landing-card border border-warm-border rounded-lg p-3">
        <summary className="cursor-pointer text-xs text-warm-muted font-mono select-none">
          Generated SQL {cached && <span className="text-emerald-500 ml-2">(cached)</span>}
          <span className="ml-2 text-warm-muted">{execution_time_ms}ms</span>
        </summary>
        <pre className="mt-3 text-xs text-warm-white overflow-x-auto whitespace-pre-wrap break-words">
          {generated_sql}
        </pre>
      </details>

      {result_data.length > 0 && (
        <div className="bg-landing-card border border-warm-border rounded-xl p-4">
          <ErrorBoundary>
            {chart_type === 'bar' && <BarChartView data={result_data} />}
            {chart_type === 'line' && <LineChartView data={result_data} />}
            {chart_type === 'table' && <TableView data={result_data} />}
          </ErrorBoundary>
        </div>
      )}

      {result_data.length === 0 && (
        <p className="text-warm-muted text-sm text-center py-4">Query returned no results.</p>
      )}

      {insight && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
          <p className="text-xs font-semibold text-accent mb-1 uppercase tracking-wide">AI Insight</p>
          <p className="text-warm-white text-sm leading-relaxed">{insight}</p>
        </div>
      )}
    </div>
  )
}
