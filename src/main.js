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
