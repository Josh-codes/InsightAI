import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

export default function BarChartView({ data }: { data: Record<string, unknown>[] }) {
  if (!data.length) return null
  const keys = Object.keys(data[0])
  const xKey = keys[0]
  const yKey = keys[1]

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey={xKey}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          angle={-30}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: '#2a2a3e', border: '1px solid #475569', borderRadius: 8 }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Bar dataKey={yKey} fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
