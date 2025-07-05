# Financial Alert System

This directory contains the rule-based alert system for the financial dashboard. The system automatically analyzes spending patterns and generates intelligent alerts to help users manage their finances better.

## Components

### AlertCard.jsx
The main alert display component that shows alerts on the dashboard. Features:
- Displays up to 3 alerts by default
- Dismissible alerts with X button
- Severity-based color coding and icons
- Settings button to configure alert preferences
- Responsive design with Tailwind CSS

### AlertBanner.jsx
An alternative full-width banner component for displaying alerts. Features:
- Collapsible alert list
- Shows all alerts in a banner format
- Better for displaying many alerts at once

### AlertSettings.jsx
Modal component for configuring alert preferences. Features:
- Adjust budget thresholds for each category
- Configure alert sensitivity settings
- Enable/disable specific alert types
- Save preferences to localStorage

## Utilities

### alertEngine.js
The core alert generation engine. Features:
- **Budget Alerts**: Warns when spending approaches or exceeds category budgets
- **Category Spikes**: Detects unusual increases in category spending
- **Unusual Spending**: Identifies months with significantly higher total spending
- **Savings Opportunities**: Alerts when savings rate is low
- **Income Changes**: Notifies about significant income decreases

### alertPreferences.js
Manages user preferences for alerts. Features:
- LocalStorage persistence
- Default budget thresholds
- Alert sensitivity settings
- Dismissed alert tracking

### alertTestData.js
Utility for creating test scenarios to demonstrate the alert system.

## Alert Types

### Budget Alerts
- **Budget Warning**: Triggered at 80% of budget (configurable)
- **Budget Exceeded**: Triggered when spending exceeds budget

### Pattern Alerts
- **Category Spike**: 50%+ increase in category spending vs previous month
- **Unusual Spending**: 25%+ increase in total spending vs average
- **Low Savings**: Savings rate below 10%
- **Income Drop**: 20%+ decrease in income vs previous month

## Default Budgets (EUR)

| Category | Budget |
|----------|--------|
| Food & Dining | 300 |
| Entertainment | 150 |
| Shopping | 200 |
| Groceries & Cafe | 250 |
| Transport | 100 |
| Housing | 800 |
| Services | 100 |
| Other | 150 |

## Usage

```jsx
import AlertCard from '@/components/dashboard/AlertCard'

// In your dashboard component
<AlertCard 
  monthlyData={monthlyData} 
  transactions={transactions} 
  maxAlerts={3} 
/>
```

## Customization

Users can customize:
- Budget thresholds for each category
- Alert sensitivity (warning threshold percentage)
- Enable/disable specific alert types
- Minimum spending amount to trigger alerts

All settings are persisted in localStorage and can be reset to defaults.

## Future Enhancements

- Email/push notifications for critical alerts
- Machine learning for personalized alert thresholds
- Integration with banking APIs for real-time alerts
- Alert history and analytics
- Custom alert rules builder
