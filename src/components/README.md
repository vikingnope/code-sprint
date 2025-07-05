# Components Dire### 💰 Savings Components (`/savings/`)

Components used in the savings center:ory

Quick overview of reusable React components for the Financial Dashboard, organized by feature.

## Structure

### 📊 Dashboard Components (`/dashboard/`)

Components used in the main dashboard view:

- **CategoryBreakdown.jsx** - Interactive pie chart showing expense categories with month selector and legend
- **ExpenseSummary.jsx** - Detailed expense analysis component with insights
- **MonthlyOverview.jsx** - Bar chart comparing monthly income vs expenses
- **RecentTransactions.jsx** - List of the 10 most recent financial transactions
- **SpendingTrend.jsx** - Line chart showing spending trends over time
- **SummaryCards.jsx** - Three summary cards displaying total income, expenses, and net balance

### � Savings Components (`/savings/`)
Components used in the savings center:

- **SavingsGoals.jsx** - Savings goal management and tracking
- **SavingsRecommendations.jsx** - Personalized savings recommendations and tips

### 🧭 Shared Components (`/shared/`)

Components used across multiple pages:

- **Navigation.jsx** - Application navigation component for routing between pages

## Usage

```jsx
// Dashboard components
import SummaryCards from '@/components/dashboard/SummaryCards'
import MonthlyOverview from '@/components/dashboard/MonthlyOverview'

// Savings components  
import SavingsGoals from '@/components/savings/SavingsGoals'
import SavingsRecommendations from '@/components/savings/SavingsRecommendations'

// Shared components
import Navigation from '@/components/shared/Navigation'

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
