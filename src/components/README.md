# Components Directory

Quick overview of reusable React components for the Financial Dashboard.

## Components

### 📊 CategoryBreakdown.jsx

Interactive pie chart showing expense categories with month selector and legend.

### 📈 MonthlyOverview.jsx

Bar chart comparing monthly income vs expenses.

### 💰 SummaryCards.jsx

Three summary cards displaying total income, expenses, and net balance.

### 📋 RecentTransactions.jsx

List of the 10 most recent financial transactions.

### 📉 SpendingTrend.jsx

Line chart showing spending trends over time.

### 📊 ExpenseSummary.jsx

Detailed expense analysis component with insights.

### 🧭 Navigation.jsx

Application navigation component for routing between pages.

## Usage

```jsx
import SummaryCards from '@/components/SummaryCards'
import MonthlyOverview from '@/components/MonthlyOverview'

const Dashboard = () => {
  return (
    <div>
      <SummaryCards monthlyData={monthlyData} />
      <MonthlyOverview monthlyData={monthlyData} />
    </div>
  )
}
```

All components use Tailwind CSS styling and are designed to be modular and reusable.
