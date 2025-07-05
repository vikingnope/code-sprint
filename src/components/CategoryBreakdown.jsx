import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1']

const CategoryBreakdown = ({ monthlyData, selectedMonth, setSelectedMonth }) => {
  const categoryData = selectedMonth && monthlyData[selectedMonth] 
    ? Object.entries(monthlyData[selectedMonth].categories).map(([category, amount]) => ({
        name: category,
        value: Math.round(amount * 100) / 100
      }))
    : []

  return (
    <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-200">Expense Categories</h2>
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-200"
        >
          {Object.keys(monthlyData).map(month => (
            <option key={month} value={month} className="bg-slate-700 text-slate-200">{month}</option>
          ))}
        </select>
      </div>
      {categoryData.length > 0 && (
        <div className="space-y-8">
          {/* Modern Pie Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={140}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#374151"
                  strokeWidth={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`€${value.toLocaleString()}`, 'Amount']} 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #374151', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    color: '#ffffff'
                  }}
                  labelStyle={{
                    color: '#ffffff',
                    fontWeight: 'bold'
                  }}
                  itemStyle={{
                    color: '#ffffff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Modern Legend in 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryData.map((entry, index) => {
              const percentage = ((entry.value / categoryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
              return (
                <div key={entry.name} className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-600/30 transition-colors">
                  <div 
                    className="w-5 h-5 rounded-full shadow-lg flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium text-sm truncate">{entry.name}</p>
                    <p className="text-slate-400 text-xs">{percentage}%</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-slate-200 font-bold text-sm">€{entry.value.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryBreakdown
