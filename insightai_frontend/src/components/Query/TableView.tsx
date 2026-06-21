import { useState } from 'react'

export default function TableView({ data }: { data: Record<string, unknown>[] }) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  if (!data.length) return <p className="text-slate-500 text-sm">No results.</p>

  const cols = Object.keys(data[0])

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey] ?? ''
        const bv = b[sortKey] ?? ''
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
        return sortDir === 'asc' ? cmp : -cmp
      })
    : data

  const toggleSort = (col: string) => {
    if (sortKey === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(col); setSortDir('asc') }
  }

  return (
    <div>
      <p className="text-xs text-slate-500 mb-2">Showing {data.length} row{data.length !== 1 ? 's' : ''}</p>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr>
              {cols.map((col) => (
                <th
                  key={col}
                  onClick={() => toggleSort(col)}
                  className="px-4 py-2 text-left text-slate-300 font-medium cursor-pointer hover:text-white whitespace-nowrap select-none"
                >
                  {col} {sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-surface' : 'bg-card'}>
                {cols.map((col) => (
                  <td key={col} className="px-4 py-2 text-slate-300 whitespace-nowrap max-w-xs truncate">
                    {row[col] === null ? <span className="text-slate-600">null</span> : String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
