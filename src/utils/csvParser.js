import Papa from 'papaparse'

export const parseCsvData = (csvText) => {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value, header) => {
      // Convert amount to number
      if (header === 'amount') {
        return parseFloat(value)
      }
      // Parse date
      if (header === 'date') {
        return new Date(value)
      }
      return value.trim()
    }
  })
  
  return result.data
}

export const categorizeTransaction = (description) => {
  const desc = description.toLowerCase()
  
  if (desc.includes('mcdonald') || desc.includes('dpz') || desc.includes('domino') || desc.includes('pizza')) {
    return 'Food & Dining'
  }
  if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('concert') || desc.includes('cinema')) {
    return 'Entertainment'
  }
  if (desc.includes('bookstore') || desc.includes('amazon') || desc.includes('amzn')) {
    return 'Shopping'
  }
  if (desc.includes('parking') || desc.includes('garage')) {
    return 'Transport'
  }
  if (desc.includes('lidl') || desc.includes('local deli') || desc.includes('starbucks')) {
    return 'Groceries & Cafe'
  }
  if (desc.includes('payroll') || desc.includes('acme')) {
    return 'Income'
  }
  if (desc.includes('refund')) {
    return 'Refunds'
  }
  if (desc.includes('rent') || desc.includes('monthlyren')) {
    return 'Housing'
  }
  if (desc.includes('tech store') || desc.includes('zara') || desc.includes('google')) {
    return 'Shopping'
  }
  if (desc.includes('revolut') || desc.includes('p2p')) {
    return 'Transfers'
  }
  if (desc.includes('malta post')) {
    return 'Services'
  }
  if (desc.includes('fx fee') || desc.includes('conv to')) {
    return 'Fees'
  }
  
  return 'Other'
}

export const getMonthlyData = (transactions) => {
  const monthlyData = {}
  
  transactions.forEach(transaction => {
    const month = transaction.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    const category = categorizeTransaction(transaction.description)
    
    if (!monthlyData[month]) {
      monthlyData[month] = {
        income: 0,
        expenses: 0,
        categories: {}
      }
    }
    
    if (transaction.type === 'credit') {
      monthlyData[month].income += transaction.amount
    } else {
      monthlyData[month].expenses += Math.abs(transaction.amount)
      
      if (!monthlyData[month].categories[category]) {
        monthlyData[month].categories[category] = 0
      }
      monthlyData[month].categories[category] += Math.abs(transaction.amount)
    }
  })
  
  return monthlyData
}
