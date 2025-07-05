# Spendy

A modern personal finance tracking application built with React and Vite.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Features To-Do

### M1 Expense Tracking & Visualization

- [x] M1.1 Present a clear view of a user's past three months of expenses. You have been provided with mock data for this.
- [x] M1.2 Categorise spending into buckets (e.g. food, rent, transport, subscriptions).
- [x] M1.3 Visualising spending (including trends) using charts/graphs.

### M2 Savings Goal Engine

- [x] M2.1 Allow users to set one or more savings goals (e.g. vacation, emergency funds).
- [x] M2.2 Automatically suggest how much a user could save per month, based on their spending patterns.
- [x] M2.3 Provide a recommendation engine that suggest areas to cut back on (e.g. "Reducing your delivery food spend by 15% could save you €100/month")

### S1 Intelligent Alerts

- [x] S1.1 A basic rule engine to simulate alerts (e.g “You’ve spent 80% of your good budget this month!”). (TODO: Fix mobile settings view)

### S2 Natural-Language Assistant

- [ ] S2.1 Use a chatbot (or any other natural-language interface) for user interaction, allowing the user to ask questions about their spending patterns and data.

### C1 Browser Extension

- [ ] C1.1 A browser extension (for Chrome-based, Gecko-based or WebKit-based browsers). This extension should provide alerts when new transactions are recorded. Notifications can be triggered manually for the purposes of this prototype.

### C2 WhatsApp Integration

- [ ] C2.1 Build a WhatsApp integration which sends push notifications to the user’s WhatsApp account. Notifications can be triggered manually for the purposes of this prototype.


## Getting Started

### Prerequisites

This project uses [pnpm](https://pnpm.io/) as the package manager. If you don't have pnpm installed, you can install it using one of the following methods:

**Using npm:**

```bash
npm install -g pnpm
```

**Using Homebrew (macOS):**

```bash
brew install pnpm
```

**Using curl:**

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd code-sprint
```

1. Install dependencies:

```bash
pnpm install
```

### Running the Development Server

To start the development server:

```bash
pnpm dev
```

This will start the Vite development server. Open your browser and navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm preview` - Preview the production build locally

## Tech Stack

- **React** - Frontend framework
- **Vite** - Build tool and development server
- **pnpm** - Package manager
- **ESLint** - Code linting
