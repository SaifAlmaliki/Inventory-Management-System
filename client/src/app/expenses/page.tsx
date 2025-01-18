"use client";

/**
 * Expenses Page Component
 *
 * Purpose:
 * This component provides a comprehensive expense analysis dashboard that allows users
 * to visualize and filter expense data across different categories and date ranges.
 *
 * Features:
 * - Interactive pie chart visualization of expenses by category
 * - Category-based filtering (Office, Professional, Salaries)
 * - Date range filtering
 * - Real-time data updates and filtering
 * - Responsive design for both desktop and mobile views
 *
 * Technical Implementation:
 * - Uses RTK Query for data fetching
 * - Implements memoization for performance optimization
 * - Utilizes Recharts for data visualization
 * - Employs TypeScript for type safety
 */

import { ExpenseByCategorySummary, useGetExpensesByCategoryQuery } from "@/state/api";
import { useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type AggregatedDataItem = {
  name: string;
  color?: string;
  amount: number;
};

type AggregatedData = {
  [category: string]: AggregatedDataItem;
};

const Expenses = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data: expensesData, isLoading, isError } = useGetExpensesByCategoryQuery();
  const expenses = useMemo(() => expensesData ?? [], [expensesData]);

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Complex data aggregation using useMemo for performance optimization
  const aggregatedData: AggregatedDataItem[] = useMemo(() => {
    // First, filter the data based on selected category and date range
    const filtered: AggregatedData = expenses
      .filter((data: ExpenseByCategorySummary) => {
        // Check if expense matches selected category (or show all)
        const matchesCategory =
          selectedCategory === "All" || data.category === selectedCategory;

        // Convert and compare dates for date range filtering
        const dataDate = parseDate(data.date);
        const matchesDate =
          !startDate ||
          !endDate ||
          (dataDate >= startDate && dataDate <= endDate);

        return matchesCategory && matchesDate;
      })
      // Reduce filtered data to aggregate amounts by category
      .reduce((acc: AggregatedData, data: ExpenseByCategorySummary) => {
        const amount = parseInt(data.amount);
        if (!acc[data.category]) {
          // Initialize new category with random color for pie chart
          acc[data.category] = { name: data.category, amount: 0 };
          // Generate random color for pie chart segment
          acc[data.category].color = `#${Math.floor(
            Math.random() * 16777215
          ).toString(16)}`;
        }
        // Accumulate amounts for each category
        acc[data.category].amount += amount;
        return acc;
      }, {});

    // Convert aggregated object to array for chart rendering
    return Object.values(filtered);
  }, [expenses, selectedCategory, startDate, endDate]);  // Recalculate when filters change

  const classNames = {
    label: "block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1",
    selectInput: "mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-gray-200 dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !expensesData) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch expenses
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-5">
        <Header name="Expenses" />
        <p className="text-sm text-gray-500">
          A visual representation of expenses over time.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Filter by Category and Date
          </h3>
          <div className="space-y-4">
            {/* CATEGORY */}
            <div>
              <label htmlFor="category" className={classNames.label}>
                Category
              </label>
              <select
                id="category"
                name="category"
                className={classNames.selectInput}
                defaultValue="All"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All</option>
                <option>Office</option>
                <option>Professional</option>
                <option>Salaries</option>
              </select>
            </div>
            {/* START DATE */}
            <div>
              <label htmlFor="start-date" className={classNames.label}>
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                className={classNames.selectInput}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            {/* END DATE */}
            <div>
              <label htmlFor="end-date" className={classNames.label}>
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                className={classNames.selectInput}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* PIE CHART */}
        <div className="flex-grow bg-white shadow rounded-lg p-4 md:p-6">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={aggregatedData}
                cx="50%"
                cy="50%"
                label
                outerRadius={150}
                fill="#8884d8"
                dataKey="amount"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {aggregatedData.map(
                  (entry: AggregatedDataItem, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === activeIndex ? "rgb(29, 78, 216)" : entry.color
                      }
                    />
                  )
                )}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
