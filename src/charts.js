import Chart from "chart.js/auto";
import { getFilteredExpenses } from "./expenses";
import { getCategoryColor, getCategoryName } from "./categories";
import { formatCurrency } from "./utils";

let categoryChart, monthlyChart;

export const initCharts = () => {
  const categoryChartCanvas = document.getElementById("categoryChart");
  const monthlyChartCanvas = document.getElementById("monthlyChart");
  const chartLegend = document.getElementById("chartLegend");

  if (!categoryChartCanvas || !monthlyChartCanvas) {
    console.error("Chart elements not found in DOM.");
    return;
  }

  // Category chart
  categoryChart = new Chart(categoryChartCanvas, {
    type: "pie",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.raw || 0;
              return `${label}: ${formatCurrency(value)}`;
            },
          },
        },
      },
    },
  });

  // Monthly chart
  monthlyChart = new Chart(monthlyChartCanvas, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Monthly Expenses",
          data: [],
          backgroundColor: "rgba(99, 102, 241, 0.8)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => "₦" + value,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || "";
              const value = context.raw || 0;
              return `${label}: ${formatCurrency(value)}`;
            },
          },
        },
      },
    },
  });
};

// Update charts with current data
export const updateCharts = () => {
  if (!categoryChart || !monthlyChart) {
    console.warn("Charts are not initialized yet.");
    return;
  }

  const filteredExpenses = getFilteredExpenses();

  // Update category chart
  const categoryData = {};
  filteredExpenses.forEach((expense) => {
    categoryData[expense.category] =
      (categoryData[expense.category] || 0) + Number.parseFloat(expense.amount);
  });

  const categoryLabels = [];
  const categoryValues = [];
  const categoryColors = [];

  for (const [categoryId, amount] of Object.entries(categoryData)) {
    categoryLabels.push(getCategoryName(categoryId));
    categoryValues.push(amount);
    categoryColors.push(getCategoryColor(categoryId));
  }

  categoryChart.data.labels = categoryLabels;
  categoryChart.data.datasets[0].data = categoryValues;
  categoryChart.data.datasets[0].backgroundColor = categoryColors;
  categoryChart.update();

  // Update chart legend
  const chartLegend = document.getElementById("chartLegend");
  if (chartLegend) {
    chartLegend.innerHTML = "";
    categoryLabels.forEach((label, index) => {
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";

      const colorLabel = document.createElement("div");
      colorLabel.className = "legend-color";

      const dot = document.createElement("div");
      dot.className = "legend-dot";
      dot.style.background = categoryColors[index];

      const name = document.createElement("span");
      name.textContent = label;

      colorLabel.appendChild(dot);
      colorLabel.appendChild(name);

      const value = document.createElement("span");
      value.textContent = formatCurrency(categoryValues[index]);

      legendItem.appendChild(colorLabel);
      legendItem.appendChild(value);

      chartLegend.appendChild(legendItem);
    });
  }

  // Update monthly chart
  const monthlyData = {};
  filteredExpenses.forEach((expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    monthlyData[monthYear] =
      (monthlyData[monthYear] || 0) + Number.parseFloat(expense.amount);
  });

  const monthlyLabels = [];
  const monthlyValues = [];

  // Sorting by date
  const sortedMonths = Object.keys(monthlyData).sort();

  sortedMonths.forEach((monthYear) => {
    const [year, month] = monthYear.split("-");
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1);
    const label = date.toLocaleDateString("en-NG", {
      month: "short",
      year: "numeric",
    });

    monthlyLabels.push(label);
    monthlyValues.push(monthlyData[monthYear]);
  });

  monthlyChart.data.labels = monthlyLabels;
  monthlyChart.data.datasets[0].data = monthlyValues;
  monthlyChart.update();
};
