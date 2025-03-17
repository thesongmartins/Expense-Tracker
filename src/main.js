import { getCategoryName } from "../public/categories.js";
import { getFilteredExpenses } from "../public/expenses.js";
import { initCharts, updateCharts } from "./charts.js";
import { formatCurrency } from "../public/utils.js";
import { renderExpenses } from "../public/renderExpenses.js";

// DOM Elements
const elements = {
  expenseForm: document.getElementById("expense-form"),
  categorySelect: document.getElementById("category"),
  editCategorySelect: document.getElementById("edit-category"),
  categoryFilterSelect: document.getElementById("category-filter"),
  addCategoryBtn: document.getElementById("add-category-btn"),
  categoryModal: document.getElementById("category-modal"),
  categoryForm: document.getElementById("category-form"),
  colorInput: document.getElementById("category-color"),
  colorPreview: document.getElementById("color-preview"),
  totalAmountEl: document.getElementById("total-amount"),
  expenseCountEl: document.getElementById("expense-count"),
  topCategoryEl: document.getElementById("top-category"),
  topCategoryAmountEl: document.getElementById("top-category-amount"),
  averageExpenseEl: document.getElementById("average-expense"),
  searchInput: document.getElementById("search"),
  dateFromInput: document.getElementById("date-from"),
  dateToInput: document.getElementById("date-to"),
  clearDateFilterBtn: document.getElementById("clear-date-filter"),
  editModal: document.getElementById("edit-modal"),
  editForm: document.getElementById("edit-form"),
  deleteModal: document.getElementById("delete-modal"),
  confirmDeleteBtn: document.getElementById("confirm-delete"),
  cancelDeleteBtn: document.getElementById("cancel-delete"),
  closeButtons: document.querySelectorAll(".close"),
};

const defaultCategories = [
  { id: "food", name: "Food & Dining", color: "#FF5733" },
  { id: "transportation", name: "Transportation", color: "#33A8FF" },
  { id: "housing", name: "Housing", color: "#33FF57" },
  { id: "entertainment", name: "Entertainment", color: "#F033FF" },
  { id: "utilities", name: "Utilities", color: "#FFB533" },
  { id: "healthcare", name: "Healthcare", color: "#33FFF1" },
  { id: "shopping", name: "Shopping", color: "#FF33A8" },
  { id: "other", name: "Other", color: "#8C33FF" },
];

// Initializing states

let categories = [...defaultCategories];
export { categories };

let expenses = [];
// Save & Load Data
const storage = {
  save: {
    expenses: () => localStorage.setItem("expenses", JSON.stringify(expenses)),
    categories: () =>
      localStorage.setItem("expensesCategories", JSON.stringify(categories)),
  },
  load: () => {
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const storedCategories = JSON.parse(
      localStorage.getItem("expensesCategories")
    );
    categories =
      storedCategories && storedCategories.length
        ? storedCategories
        : [...defaultCategories];
  },
};

// Populate category dropdowns
const populateCategoryDropdowns = () => {
  elements.categorySelect.innerHTML = `<option value='' disabled selected>Select a category</option>`;
  elements.editCategorySelect.innerHTML = "";
  elements.categoryFilterSelect.innerHTML = `<option value='all'>All Categories</option>`;

  categories.forEach((category) => {
    const option = new Option(category.name, category.id);
    elements.categorySelect.appendChild(option);
    elements.editCategorySelect.appendChild(option.cloneNode(true));
    elements.categoryFilterSelect.appendChild(option.cloneNode(true));
  });
};

// Update summary cards
const updateSummary = () => {
  const filteredExpenses = getFilteredExpenses(expenses);
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  elements.totalAmountEl.textContent = formatCurrency(totalAmount);

  elements.expenseCountEl.textContent = `${filteredExpenses.length} expense${
    filteredExpenses.length !== 1 ? "s" : ""
  }`;

  const categoryTotals = filteredExpenses.reduce(
    (acc, { category, amount }) => {
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    },
    {}
  );

  const topCategoryId = Object.keys(categoryTotals).reduce(
    (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
    ""
  );

  if (topCategoryId) {
    elements.topCategoryEl.textContent = getCategoryName(topCategoryId);
    elements.topCategoryAmountEl.textContent = formatCurrency(
      categoryTotals[topCategoryId]
    );
  } else {
    elements.topCategoryEl.textContent = "N/A";
    elements.topCategoryAmountEl.textContent = formatCurrency(0);
  }

  elements.averageExpenseEl.textContent = formatCurrency(
    filteredExpenses.length ? totalAmount / filteredExpenses.length : 0
  );
};

// Add event listeners
const setupEventListeners = () => {
  elements.expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addExpense({
      amount: Number(document.getElementById("amount").value),
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      date: document.getElementById("date").value,
    });
    e.target.reset();
    document.getElementById("date").valueAsDate = new Date();
  });

  elements.colorInput.addEventListener("input", () => {
    elements.colorPreview.style.background = elements.colorInput.value;
  });

  elements.confirmDeleteBtn.addEventListener("click", () => {
    deleteExpense(document.getElementById("delete-id").value);
    elements.deleteModal.style.display = "none";
  });

  elements.cancelDeleteBtn.addEventListener("click", () => {
    elements.deleteModal.style.display = "none";
  });

  elements.closeButtons.forEach((button) =>
    button.addEventListener("click", closeModals)
  );

  elements.searchInput.addEventListener("input", () => {
    searchTerm = elements.searchInput.value;
    renderExpenses(ex);
    updateSummary();
  });
};

// Initialize app
const init = () => {
  document.getElementById("date").valueAsDate = new Date();
  storage.load();
  populateCategoryDropdowns();
  renderExpenses(expenses);
  updateSummary();
  initCharts();
  updateCharts();
  setupEventListeners();
};

document.addEventListener("DOMContentLoaded", init);
