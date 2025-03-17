import { initCharts, updateCharts } from "./charts.js";
import { formatCurrency, formatDate } from "./utils.js";

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
    id: "housing",
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
    color: "#FFF1",
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

// Initializing states
let expenses = [];
let categories = [...defaultCategories];
console.log(categories);
let activeFilter = "all";
let dateRange = { from: null, to: null };
let searchTerm = "";

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
const saveExpenses = () => {
  localStorage.setItem("expenses", JSON.stringify(expenses));
};

const saveCategories = () => {
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
    option.value = category.id;
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

// Format date

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
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        if (expenseDate > endDate) {
          return false;
        }
      }
    }

    // Filter by search term
    if (searchTerm) {
      const description = expense.description.toLowerCase();
      const category = getCategoryName(expense.category).toLowerCase();
      if (
        !description.includes(searchTerm.toLowerCase()) &&
        !category.includes(searchTerm.toLowerCase())
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

  // Show/hide no expense message
  if (filteredExpenses.length === 0) {
    noExpensesMessage.style.display = "block";
    document.getElementById("expense-table").style.display = "none";

    // Update message based on whether there are any expenses
    if (expenses.length === 0) {
      noExpensesMessage.textContent =
        "No expenses yet, Add your first expense!";
    } else {
      noExpensesMessage.textContent = "No expenses match your search criteria.";
    }
  } else {
    noExpensesMessage.style.display = "none";
    document.getElementById("expense-table").style.display = "table";

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
      actionCell.appendChild(actionButtons);
      row.appendChild(actionCell);

      expenseList.appendChild(row);
    });
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
  expenseCountEl.textContent = `${filteredExpenses.length} expense${
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
    topCategoryAmountEl.textContent = "₦0.00";
  }

  // Calculate average expense
  const averageExpense =
    filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
  averageExpenseEl.textContent = formatCurrency(averageExpense);
};

// Initializing charts
initCharts();

//update charts
updateCharts();
// Add a new expense
const addExpense = (expenseData) => {
  const newExpense = {
    id: Date.now().toString(),
    ...expenseData,
    amount: Number.parseFloat(expenseData.amount),
  };

  expenses.push(newExpense);
  saveExpenses();
  renderExpenses();
  updateSummary();
};

// Update an existing expense
const updateExpense = (id, updatedData) => {
  const index = expenses.findIndex((expense) => expense.id === id);
  if (index !== -1) {
    expenses[index] = {
      ...expenses[index],
      ...updatedData,
      amount: Number.parseFloat(updatedData.amount),
    };

    saveExpenses();
    renderExpenses();
    updateSummary();
  }
};

// Delete an expense
const deleteExpense = (id) => {
  expenses = expenses.filter((expense) => expense.id !== id);
  saveExpenses();
  renderExpenses();
  updateSummary();
};

// Add a new category
const addCategory = (categoryData) => {
  const newCategory = {
    id: categoryData.name.toLowerCase().replace(/\s+/g, "-"),
    ...categoryData,
  };

  categories.push(newCategory);
  saveCategories();
  populateCategoryDropdowns();
};

// Open edit modal
const openEditModal = (expense) => {
  document.getElementById("edit-id").value = expense.id;
  document.getElementById("edit-amount").value = expense.amount;
  document.getElementById("edit-category").value = expense.category;
  document.getElementById("edit-description").value = expense.description;
  document.getElementById("edit-date").value = expense.date;

  editModal.style.display = "block";
};

// Open delete modal
const openDeleteModal = (id) => {
  document.getElementById("delete-id").value = id;
  deleteModal.style.display = "block";
};

// Close all modals
const closeModals = () => {
  if (categoryModal) categoryModal.style.display = "none";
  if (editModal) editModal.style.display = "none";
  if (deleteModal) deleteModal.style.display = "none";
};

// Setup event listeners
const setupEventListeners = () => {
  // Expense form submission
  expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const expenseData = {
      amount: document.getElementById("amount").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      date: document.getElementById("date").value,
    };

    addExpense(expenseData);
    this.reset();
    document.getElementById("date").valueAsDate = new Date();
  });

  // Add category button
  addCategoryBtn.addEventListener("click", () => {
    categoryModal.style.display = "block";
  });

  // Category form submission
  categoryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const categoryData = {
      name: document.getElementById("category-name").value,
      color: document.getElementById("category-color").value,
    };

    addCategory(categoryData);
    this.reset();
    categoryModal.style.display = "none";
  });

  // Color input change
  colorInput.addEventListener("input", () => {
    colorPreview.style.background = this.value;
  });

  // Initialize color preview
  colorPreview.style.background = colorInput.value;

  // Edit form submission
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const updatedData = {
      amount: document.getElementById("edit-amount").value,
      category: document.getElementById("edit-category").value,
      description: document.getElementById("edit-description").value,
      date: document.getElementById("edit-date").value,
    };

    updateExpense(id, updatedData);
    editModal.style.display = "none";
  });
};

// Confirm delete button
confirmDeleteBtn.addEventListener("click", () => {
  const id = document.getElementById("delete-id").value;
  deleteExpense(id);
  deleteModal.style.display = "none";
});

// Cancel delete button
cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

// close buttons for modals
closeButtons.forEach((button) => {
  button.addEventListener("click", closeModals);
});

// Close modals when cclicking outside
window.addEventListener("click", (e) => {
  if (
    e.target === categoryModal ||
    e.target === editModal ||
    e.target === deleteModal
  ) {
    closeModals();
  }
});

// Tab buttons
tabBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = this.getAttribute("data-tab");

    // Update active tab button
    tabBtns.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");

    // Show active tab pane
    tabPanes.forEach((pane) => pane.classList.remove("active"));
    document.getElementById(`${tabId}-view`).classList.add("active");

    // Update charts if chart view is showing
    if (tabId === "chart") {
      updateCharts();
    }
  });
  // Chart tab buttons
  chartTabBtns.forEach((button) => {
    button.addEventListener("click", function () {
      const chartId = this.getAttribute("data-chart");

      // Update active chart tab button
      chartTabBtns.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Show active chart
      if (chartId === "category") {
        categoryChartCanvas.style.display = "block";
        monthlyChartCanvas.style.display = "none";
      } else {
        categoryChartCanvas.style.display = "none";
        monthlyChartCanvas.style.display = "block";
      }

      // Update charts
      updateCharts();
    });
  });

  // Search input
  searchInput.addEventListener("input", function () {
    searchTerm = this.value;
    renderExpenses();
    updateSummary();
  });

  // Category filter
  categoryFilterEl.addEventListener("change", function () {
    activeFilter = this.value;
    renderExpenses();
    updateSummary();
  });

  // Date range filters
  dateFromInput.addEventListener("change", function () {
    dateRange.from = this.value ? new Date(this.value) : null;
    renderExpenses();
    updateSummary();
  });

  dateToInput.addEventListener("change", function () {
    dateRange.to = this.value ? new Date(this.value) : null;
    renderExpenses();
    updateSummary();
  });

  // Clear date filter
  clearDateFilterBtn.addEventListener("click", () => {
    dateRange = { from: null, to: null };
    dateFromInput.value = "";
    dateToInput.value = "";
    renderExpenses();
    updateSummary();
  });
});

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

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", init);
