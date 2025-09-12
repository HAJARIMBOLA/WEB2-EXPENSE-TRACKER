import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export default function LineMini({ data, dataKey='value' }) {
  return (
    <div className="h-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#3b82f6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
