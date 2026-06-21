import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

export default function LineChartView({ data }: { data: Record<string, unknown>[] }) {
  if (!data.length) return null
  const keys = Object.keys(data[0])
  const xKey = keys[0]
  const yKey = keys[1] ?? keys[0]

  const sorted = [...data].sort((a, b) => String(a[xKey]).localeCompare(String(b[xKey])))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={sorted} margin={{ top: 8, right: 16, left: 8, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3D3832" />
        <XAxis
          dataKey={xKey}
          tick={{ fill: '#A89B8C', fontSize: 11 }}
          angle={-30}
          textAnchor="end"
          interval={Math.floor(sorted.length / 8)}
        />
        <YAxis tick={{ fill: '#A89B8C', fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: '#2C2822', border: '1px solid #3D3832', borderRadius: 8 }}
          labelStyle={{ color: '#F5E6D3' }}
        />
        <Line type="monotone" dataKey={yKey} stroke="#E07A5F" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
