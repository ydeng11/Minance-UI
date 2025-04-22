import React, { useCallback, useEffect, useState } from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import { CategoryFilter } from './CategoryFilter';
import { ExpenseBarChart } from './ExpenseBarChart';
import { TotalExpenseChart } from './TotalExpenseChart';
import { CategoryPieChart } from './CategoryPieChart';
import { ChartDataItem } from '@/types/chart';

// Key for storing selected categories in localStorage
const SELECTED_CATEGORIES_KEY = 'bar-chart-selected-categories';
// Key for storing chart type in localStorage
const CHART_TYPE_KEY = 'bar-chart-type';

const BarChartComponent: React.FC = () => {
    const { transactions } = useTransactionStore();
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [chartType, setChartType] = useState(() => {
        // Initialize chart type from localStorage or default to "stacked"
        return localStorage.getItem(CHART_TYPE_KEY) || "stacked";
    });
    const [hasSetInitialState, setHasSetInitialState] = useState(false);

    // Save selectedCategories to localStorage when it changes
    useEffect(() => {
        if (hasSetInitialState && selectedCategories.length > 0) {
            localStorage.setItem(SELECTED_CATEGORIES_KEY, JSON.stringify(selectedCategories));
        }
    }, [selectedCategories, hasSetInitialState]);

    // Save chartType to localStorage when it changes
    useEffect(() => {
        localStorage.setItem(CHART_TYPE_KEY, chartType);
    }, [chartType]);

    useEffect(() => {
        const uniqueCategories = Array.from(
            new Set(transactions.map(t => t.category || 'Uncategorized'))
        );
        setCategories(uniqueCategories);

        // Try to load previously selected categories from localStorage
        try {
            const savedCategories = localStorage.getItem(SELECTED_CATEGORIES_KEY);
            if (savedCategories) {
                const parsedCategories = JSON.parse(savedCategories);
                // Filter out any saved categories that don't exist in current data
                const validCategories = parsedCategories.filter(
                    (cat: string) => uniqueCategories.includes(cat)
                );

                if (validCategories.length > 0) {
                    setSelectedCategories(validCategories);
                } else {
                    // If no valid categories found, use all categories
                    setSelectedCategories(uniqueCategories);
                }
            } else {
                // If no saved categories, use all categories
                setSelectedCategories(uniqueCategories);
            }
        } catch (error) {
            console.error("Error loading saved categories:", error);
            setSelectedCategories(uniqueCategories);
        }

        setHasSetInitialState(true);
    }, [transactions]);

    const processTransactionData = useCallback(() => {
        const monthlyData = transactions.reduce((acc, transaction) => {
            const [year, month] = transaction.transactionDate.split('-');
            const monthYear = `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' })} ${year.slice(2)}`;

            if (!acc[monthYear]) {
                acc[monthYear] = {};
            }

            const category = transaction.category || 'Uncategorized';
            acc[monthYear][category] = (acc[monthYear][category] || 0) + transaction.amount;

            return acc;
        }, {} as Record<string, Record<string, number>>);

        return Object.entries(monthlyData).map(([date, categories]) => ({
            date,
            ...categories
        }));
    }, [transactions]);

    useEffect(() => {
        const data = processTransactionData();
        setChartData(data);
    }, [transactions, processTransactionData]);

    // Custom wrapper for setSelectedCategories that also persists to localStorage
    const handleSetSelectedCategories = (categories: string[]) => {
        setSelectedCategories(categories);
    };

    // Custom wrapper for setChartType that also persists to localStorage
    const handleSetChartType = (type: string) => {
        setChartType(type);
    };

    const dataFormatter = (number: number) =>
        Intl.NumberFormat('us', {
            style: 'currency',
            currency: 'USD'
        }).format(number);

    return (
        <div>
            <CategoryFilter
                chartType={chartType}
                setChartType={handleSetChartType}
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={handleSetSelectedCategories}
                hasSetInitialState={hasSetInitialState}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                    <ExpenseBarChart
                        chartData={chartData}
                        chartType={chartType}
                        selectedCategories={selectedCategories}
                        dataFormatter={dataFormatter}
                    />
                </div>
                <div className="lg:col-span-2">
                    <TotalExpenseChart
                        chartData={chartData}
                        selectedCategories={selectedCategories}
                        dataFormatter={dataFormatter}
                    />
                </div>
                <div className="lg:col-span-2">
                    <CategoryPieChart selectedCategories={selectedCategories} />
                </div>
            </div>
        </div>
    );
};

export default BarChartComponent;
