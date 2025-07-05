import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { FaChartLine } from 'react-icons/fa'

const MonthlyOverview = ({ monthlyData }) => {
  const monthlyChartData = Object.entries(monthlyData).map(([month, data]) => ({
    month: month.split(' ')[0], // Get just the month name
    income: data.income,
    expenses: data.expenses,
    net: data.income - data.expenses
  }))

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 mb-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <FaChartLine className="text-blue-400 text-xl" />
        <h2 className="text-2xl font-bold text-slate-200">Monthly Overview</h2>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
          <YAxis tick={{ fill: '#9ca3af' }} />
          <Tooltip 
            formatter={(value) => [`€${value.toLocaleString()}`, '']} 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #374151', 
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              color: '#f1f5f9'
            }}
          />
          <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyOverview
