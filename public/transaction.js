import { getStoredTransactions, storeTransactions } from "../public/storage";

// Get all transactions
export function getTransactions() {
  return getStoredTransactions();
}

// Add a transaction
export function addTransaction(transaction) {
  const transactions = getStoredTransactions();
  console.log('storage point', transaction)

  // Create a new transaction object with a unique ID
  const newTransaction = {
    id: generateID(),
    description: transaction.description,
    amount: Number.parseFloat(transaction.amount),
    category: transaction.category,
    date: transaction.date,
  };

  // Add to transactions array
  transactions.push(newTransaction);

  // Save to local storage
  const saved = storeTransactions(transactions);

  // Verify the transaction was saved
  if (saved) {
    console.log("Transaction saved successfully");
  } else {
    console.error("Failed to save transaction");
  }

  return newTransaction;
}

// Delete a transaction
export function deleteTransaction(id) {
  const transactions = getStoredTransactions();

  // Filter out the transaction with the given ID
  const updatedTransactions = transactions.filter(
    (transaction) => transaction.id !== id
  );

  // Save to local storage
  storeTransactions(updatedTransactions);
}

// Generate a random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Calculate total income
export function calculateIncome(transactions) {
  return transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);
}

// Calculate total expense
export function calculateExpense(transactions) {
  return transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0)
    .toFixed(2);
}

// Calculate balance
export function calculateBalance(transactions) {
  return transactions
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);
}

// Group transactions by category
export function groupByCategory(transactions) {
  const expensesByCategory = {};

  transactions
    .filter((transaction) => transaction.amount < 0)
    .forEach((transaction) => {
      if (!expensesByCategory[transaction.category]) {
        expensesByCategory[transaction.category] = 0;
      }
      expensesByCategory[transaction.category] += Math.abs(transaction.amount);
    });

  return expensesByCategory;
}

// Group transactions by month
export function groupByMonth(transactions) {
  const monthlyData = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        income: 0,
        expense: 0,
      };
    }

    if (transaction.amount > 0) {
      monthlyData[monthYear].income += transaction.amount;
    } else {
      monthlyData[monthYear].expense += Math.abs(transaction.amount);
    }
  });

  return monthlyData;
}
