import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const SpendingTrend = ({ monthlyData }) => {
  const monthlyChartData = Object.entries(monthlyData).map(([month, data]) => ({
    month: month.split(' ')[0], // Get just the month name
    income: data.income,
    expenses: data.expenses,
    net: data.income - data.expenses
  }))

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">Spending Trend</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
          <YAxis tick={{ fill: '#9ca3af' }} />
          <Tooltip 
            formatter={(value, name) => [`€${value.toLocaleString()}`, name]} 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #374151', 
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              color: '#f1f5f9'
            }}
            animationDuration={300}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#EF4444" 
            strokeWidth={3} 
            name="Expenses"
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="net" 
            stroke="#10B981" 
            strokeWidth={3} 
            name="Net Balance"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SpendingTrend
