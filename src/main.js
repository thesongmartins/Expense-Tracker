import Chart from "chart.js/auto";
import { color } from "chart.js/helpers";

// DOM Elements
const expenseForm = document.getElementById("expense-form");
const categorySelect = document.getElementById("category");
const editCategorySelect = document.getElementById("edit-category");
const categoryFilterSelect = document.getElementById("category-filter");
const addCategoryBtn = document.getElementById("add-category-btn");
const categoryModal = document.getElementById("category-modal");
const categoryForm = document.getElementById("category-form");
const colorInput = document.getElementById("category-color");
const colorPreview = document.getElementById("color-preview");
const expenseList = document.getElementById("expense-list");
const noExpensesMessage = document.getElementById("no-expenses-message");
const totalAmountEl = document.getElementById("total-amount");
const expenseCountEl = document.getElementById("expense-count");
const topCategoryEl = document.getElementById("top-category");
const topCategoryAmountEl = document.getElementById("top-category-amount");
const averageExpenseEl = document.getElementById("average-expense");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");
const chartTabBtns = document.querySelectorAll(".chart-tab-btn");
const categoryChartCanvas = document.getElementById("category-chart");
const monthlyChartCanvas = document.getElementById("monthly-chart");
const chartLegend = document.getElementById("chart-legend");
const searchInput = document.getElementById("search");
const categoryFilterEl = document.getElementById("category-filter");
const dateFromInput = document.getElementById("date-from");
const dateToInput = document.getElementById("date-to");
const clearDateFilterBtn = document.getElementById("clear-date-filter");
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const deleteModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const closeButtons = document.querySelectorAll(".close");

// Default Categories with colors
const defaultCategories = [
  {
    id: "food",
    name: "Food & Dining",
    color: "#FF5733",
  },
  {
    id: "transportation",
    name: "Transportation",
    color: "#33A8FF",
  },
  {
    id: "hosuing",
    name: "Housing",
    color: "#33FF57",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    color: "#F033FF",
  },
  {
    id: "utilities",
    name: "Utilities",
    color: "#FFB533",
  },
  {
    id: "healthcare",
    name: "Health Care",
    color: "###FFF1",
  },
  {
    id: "shopping",
    name: "Shopping",
    color: "#FF33A8",
  },
  {
    id: "other",
    name: "Other",
    color: "#8C33FF",
  },
];

// Intializing states
let expenses = [];
let categories = [...defaultCategories];
console.log(categories);
let activeFilter = "all";
let dateRange = { from: null, to: null };
let searchTerm = "";
let categoryChart = null;
let monthlyChart = null;

const init = () => {
  // Setting date as default for date inputs
  document.getElementById("date").valueAsDate = new Date();

  // Load data from localStorage
  loadData();

  // Populates category dropdowns
  populateCategoryDropdowns();

  // Rendering expenses
  renderExpenses();

  // Update summary
  updateSummary();

  // Initialize charts
  initCharts();

  //Setup event listeners
  setupEventListeners();
};

// Load data from localstorage
const loadData = () => {
  const savedExpenses = localStorage.getItem("expenses");
  console.log(savedExpenses);
  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
  }

  const savedCategories = localStorage.getItem("expensesCategories");
  if (savedCategories) {
    categories = JSON.parse(savedCategories);
  }
};

// saving data to local storage
const savedExpenses = () => {
  localStorage.setItem("expenses", JSON.stringify(expenses));
};

const savedCategories = () => {
  localStorage.setItem("expensesCategories", JSON.stringify(categories));
};

// Populates categories dropdown
const populateCategoryDropdowns = () => {
  // Clear existing options (except the first one for main select)
  categorySelect.innerHTML = `<option value='' disabled selected>Select a category</option>`;
  editCategorySelect.innerHTML = "";
  categoryFilterSelect.innerHTML = `<option value='all'>All Categories</option>`;

  // Adding categories to dropdowns
  categories.forEach((category) => {
    // Main category select
    const option = document.createElement("option");
    editOption.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);

    // Edit form category select
    const editOption = document.createElement("option");
    editOption.value = category.id;
    editOption.textContent = category.name;
    editCategorySelect.append(editOption);

    // Filter Category select
    const filterOption = document.createElement("option");
    filterOption.value = category.id;
    filterOption.textContent = category.name;
    categoryFilterSelect.appendChild(filterOption);
  });
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

// Format Currency
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-NG"),
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};

// Getting
