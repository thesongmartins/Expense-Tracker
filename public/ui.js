import {
  calculateBalance,
  calculateIncome,
  calculateExpense,
} from "../public/transaction.js";
import { getStoredTransactions, storeTransactions } from "../public/storage.js";

// Get all transactions
export function getTransactions() {
  return getStoredTransactions();
}

// Add a transaction
export function addTransaction(transaction) {
  const transactions = getStoredTransactions();

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
  storeTransactions(transactions);

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

// // Calculate total income
export function calculateIncomee(transactions) {
  return transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);
}

// // Calculate total expense
export function calculateExpensee(transactions) {
  return transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0)
    .toFixed(2);
}

// // Calculate balance
export function calculateBalancee(transactions) {
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

// Initialize UI event listeners
export function initUI({
  onAddTransaction,
  onDeleteTransaction,
  onChartTabClick,
}) {
  // Add transaction form
  const form = document.getElementById("transaction-form");
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (submitButton.disabled) return;
    submitButton.disabled = true;

    console.log("Button clicked");

    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    onAddTransaction({ description, amount, category, date });

    // Reset form and re-enable button
    form.reset();
    setTimeout(() => {
      submitButton.disabled = false;
    }, 500); // Small delay to prevent accidental double clicks
  });


  // Set today's date as default
  const dateInput = document.getElementById("date");
  dateInput.valueAsDate = new Date();

  // Chart tabs
  const chartTabs = document.querySelectorAll(".chart-tab");
  chartTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      chartTabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      tab.classList.add("active");

      // Call the chart tab click handler
      onChartTabClick(tab.dataset.chart);
    });
  });

  // Transaction list click event for delete buttons
  const transactionList = document.getElementById("transaction-list");
  transactionList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = Number.parseInt(e.target.dataset.id);
      onDeleteTransaction(id);
    }
  });
}

// Update UI with transactions
export function updateUI(transactions) {
  updateBalance(transactions);
  updateTransactionList(transactions);
}

// Update balance, income, and expense
function updateBalance(transactions) {
  const balance = calculateBalance(transactions);
  const income = calculateIncome(transactions);
  const expense = calculateExpense(transactions);

  document.getElementById("balance").textContent = formatAmount(balance);
  document.getElementById("income").textContent = formatAmount(income);
  document.getElementById("expense").textContent = formatAmount(expense);
}

// Update transaction list
function updateTransactionList(transactions) {
  const transactionList = document.getElementById("transaction-list");

  // Clear list
  transactionList.innerHTML = "";

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Add transactions to list
  sortedTransactions.forEach((transaction) => {
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    const formattedDate = new Date(transaction.date).toLocaleDateString();

    item.innerHTML = `
      <div class="transaction-details">
        <span>${transaction.description}</span>
        <span class="transaction-category">${transaction.category}</span>
        <span class="transaction-date">${formattedDate}</span>
      </div>
      <div>
        <span>${formatAmount(transaction.amount)}</span>
        <button class="delete-btn" data-id="${transaction.id}">X</button>
      </div>
    `;

    transactionList.appendChild(item);
  });
}

// Format amount as currency
function formatAmount(amount) {
  const sign = Number.parseFloat(amount) < 0 ? "-" : "";
  return `${sign}$${Math.abs(amount).toFixed(2)}`;
}
