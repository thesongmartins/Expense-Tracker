// import Chart from "chart.js/auto";
// const { Chart } = await import("chart.js");
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(PieController, ArcElement, Tooltip, Legend);

import { groupByCategory, groupByMonth } from "../public/transaction";

// Chart instances
let expenseCategoriesChart = null;
let monthlySummaryChart = null;

// Update charts with transaction data
export function updateCharts(transactions) {
  updateExpenseCategoriesChart(transactions);
  updateMonthlySummaryChart(transactions);
}

// Update expense categories chart
function updateExpenseCategoriesChart(transactions) {
  const ctx = document
    .getElementById("expense-categories-chart")
    .getContext("2d");

  // Group expenses by category
  const expensesByCategory = groupByCategory(transactions);

  // Prepare data for chart
  const categories = Object.keys(expensesByCategory);
  const amounts = Object.values(expensesByCategory);

  // Generate colors for each category
  const colors = generateColors(categories.length);

  // Destroy previous chart if it exists
  if (expenseCategoriesChart) {
    expenseCategoriesChart.destroy();
  }

  // Create new chart
  expenseCategoriesChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Expense Categories",
        },
      },
    },
  });
}

// Update monthly summary chart
function updateMonthlySummaryChart(transactions) {
  const ctx = document.getElementById("monthly-summary-chart").getContext("2d");

  // Group transactions by month
  const monthlyData = groupByMonth(transactions);

  // Sort months chronologically
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    const [aMonth, aYear] = a.split("/").map(Number);
    const [bMonth, bYear] = b.split("/").map(Number);

    if (aYear !== bYear) {
      return aYear - bYear;
    }

    return aMonth - bMonth;
  });

  // Get last 6 months (or all if less than 6)
  const months = sortedMonths.slice(-6);

  // Prepare data for chart
  const incomeData = months.map((month) => monthlyData[month].income);
  const expenseData = months.map((month) => monthlyData[month].expense);

  // Format month labels
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const labels = months.map((month) => {
    const [monthNum, year] = month.split("/");
    return `${monthNames[Number.parseInt(monthNum) - 1]} ${year}`;
  });

  // Destroy previous chart if it exists
  if (monthlySummaryChart) {
    monthlySummaryChart.destroy();
  }

  // Create new chart
  monthlySummaryChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          backgroundColor: "rgba(46, 204, 113, 0.5)",
          borderColor: "rgba(46, 204, 113, 1)",
          borderWidth: 1,
        },
        {
          label: "Expenses",
          data: expenseData,
          backgroundColor: "rgba(231, 76, 60, 0.5)",
          borderColor: "rgba(231, 76, 60, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Monthly Income vs Expenses",
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => "$" + value,
          },
        },
      },
    },
  });
}

// Generate colors for chart
function generateColors(count) {
  const colors = [
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 159, 64, 0.7)",
    "rgba(199, 199, 199, 0.7)",
    "rgba(83, 102, 255, 0.7)",
    "rgba(40, 159, 64, 0.7)",
    "rgba(210, 199, 199, 0.7)",
  ];

  // If we need more colors than we have, generate them
  if (count > colors.length) {
    for (let i = colors.length; i < count; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
    }
  }

  return colors.slice(0, count);
}
