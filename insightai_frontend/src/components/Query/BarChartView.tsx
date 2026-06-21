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
        <CartesianGrid strokeDasharray="3 3" stroke="#3D3832" />
        <XAxis
          dataKey={xKey}
          tick={{ fill: '#A89B8C', fontSize: 11 }}
          angle={-30}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fill: '#A89B8C', fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: '#2C2822', border: '1px solid #3D3832', borderRadius: 8 }}
          labelStyle={{ color: '#F5E6D3' }}
        />
        <Bar dataKey={yKey} fill="#E07A5F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
