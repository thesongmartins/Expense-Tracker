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

// Getting category name from ID
const getCategoryName = (categoryId) => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : category.id;
};

// Get category color from ID
const getCategoryColor = (categoryId) => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.color : "#cccccc";
};

// Filter expenses based on active filters
const getFilteredExpenses = () => {
  return expenses.filter((expense) => {
    // Filter by category
    if (activeFilter !== "all" && expense.category !== activeFilter) {
      return false;
    }

    // Filtering by date range
    if (dateRange.from || dateRange.to) {
      const expenseDate = new Date(expense.date);
      if (dateRange.from && expenseDate < dateRange.from) {
        return false;
      }
    }

    if (dateRange.to) {
      const endDate = new Date(dateRange.from.to);
      endDate.setHours(23, 59, 59, 999);
      if (expenseDate > endDate) {
        return false;
      }
    }

    // Filter by search term
    if (searchTerm) {
      const description = expense.description.toLowerCase();
      const category = getCategoryName(expense.category).toLowerCase();
      if (
        !description.includes(
          searchTerm.toLowerCase() &&
            !category.includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }
    }
    return true;
  });
};

// Render expenses in the table
const renderExpenses = () => {
  const filteredExpenses = getFilteredExpenses();
  console.log(filteredExpenses);

  // Clear the expense list
  expenseList.innerHTML = "";

  // Show/hid no expense message
  if (filteredExpenses.length === 0) {
    noExpensesMessage.style.display = "block";
    document.getElementById("expenses-table").style.display = "none";

    // Update message based on whether there are any expenses
    if (expenses.length === 0) {
      noExpensesMessage.textContent =
        "No expenses yet, Add your first expense!";
    } else {
      noExpensesMessage.textContent = "No expenses match your search criteria.";
    }
  } else {
    noExpensesMessage.style.display = "none";
    document.getElementById("expenses-table").style.display = "table";

    // Add expenses to the table
    filteredExpenses.forEach((expense) => {
      const row = document.createElement("tr");

      // Date cell
      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(expense.date);
      row.appendChild(dateCell);

      // Category cell
      const categoryCell = document.createElement("td");
      const categoryBadge = document.createElement("div");
      categoryBadge.className = "category-badge";

      const categoryDot = document.createElement("div");
      categoryDot.className = "category-dot";
      categoryDot.style.background = getCategoryColor(expense.category);

      const categoryName = document.createElement("span");
      categoryName.textContent = getCategoryName(expense.category);

      categoryBadge.appendChild(categoryDot);
      categoryBadge.appendChild(categoryName);
      categoryCell.appendChild(categoryBadge);
      row.appendChild(categoryCell);

      // Description cell
      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = expense.description;
      row.appendChild(descriptionCell);

      // Amount cell
      const amountCell = document.createElement("td");
      amountCell.textContent = formatCurrency(expense.amount);
      amountCell.style.fontWeight = "500";
      row.appendChild(amountCell);

      // Actions cell
      const actionCell = document.createElement("td");
      const actionButtons = document.createElement("div");
      actionButtons.className = "action-buttons";

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.className = "action-btn";
      editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
      editBtn.addEventListener("click", () => openEditModal(expense));

      // Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "action-btn delete";
      deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
      deleteBtn.addEventListener("click", () => openDeleteModal(expense.id));

      actionButtons.appendChild(editBtn);
      actionButtons.appendChild(deleteBtn);
      actionButtons.appendChild(actionButtons);
      row.appendChild(actionCell);

      expenseList.appendChild(row);
    });

    expenseList.appendChild(row);
  }
};

// Updating summary cards
const updateSummary = () => {
  const filteredExpenses = getFilteredExpenses();

  // Calculating total amount
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + Number.parseFloat(expense.amount),
    0
  );
  totalAmountEl.textContent = formatCurrency(totalAmount);

  // Update expense count
  expenseCountEl.textContent = `${filteredExpenses.length} expenses ${
    filteredExpenses.length !== 1 ? "s" : ""
  }`;

  // Calculate top category
  const categoryTotals = {};
  filteredExpenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += Number.parseFloat(expense.amount);
    } else {
      categoryTotals[expense.category] = Number.parseFloat(expense.amount);
    }
  });

  let topCategoryId = "";
  let maxAmount = 0;

  for (const [categoryId, amount] of Object.entries(categoryTotals)) {
    if (amount > maxAmount) {
      maxAmount = amount;
      topCategoryId = categoryId;
    }
  }

  if (topCategoryId) {
    topCategoryEl.textContent = getCategoryName(topCategoryId);
    topCategoryAmountEl.textContent = formatCurrency(maxAmount);
  } else {
    topCategoryEl.textContent = "N/A";
    topCategoryAmountEl.textContent = "0.00";
  }
};
