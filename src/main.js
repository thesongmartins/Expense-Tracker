import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../public/transaction.js";
import { updateUI, initUI } from "../public/ui.js";
import { updateCharts } from "../public/charts.js";
import { displayStorageStatus } from "../public/storageCheck.js";
console.log("Hello from main.js");
// Initialize the application
function init() {
  console.log("Initializing the app...");
  // Check storage availability
  displayStorageStatus();

  // Initialize UI
  initUI({
    onAddTransaction: handleAddTransaction,
    onDeleteTransaction: handleDeleteTransaction,
    onChartTabClick: handleChartTabClick,
  });

  // Load and display transactions
  const transactions = getTransactions();
  updateUI(transactions);

  // Update charts
  updateCharts(transactions);

  // Log to verify transactions are loaded
  console.log("Loaded transactions:", transactions);
}

// Handle adding a new transaction
function handleAddTransaction(transaction) {
  const newTransaction = addTransaction(transaction);
  console.log("Transaction added:", newTransaction);

  const transactions = getTransactions();
  updateUI(transactions);
  updateCharts(transactions);
}

// Handle deleting a transaction
function handleDeleteTransaction(id) {
  deleteTransaction(id);
  const transactions = getTransactions();
  updateUI(transactions);
  updateCharts(transactions);
}

// Handle chart tab clicks
function handleChartTabClick(chartId) {
  const expenseCategoriesChart = document.getElementById(
    "expense-categories-chart"
  );
  const monthlySummaryChart = document.getElementById("monthly-summary-chart");

  if (chartId === "expense-categories") {
    expenseCategoriesChart.style.display = "block";
    monthlySummaryChart.style.display = "none";
  } else {
    expenseCategoriesChart.style.display = "none";
    monthlySummaryChart.style.display = "block";
  }
}

// Initialize the app when DOM is loaded
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM loaded");
//   init();
// });
window.onload = init;
console.log("DOM loaded");
init();
