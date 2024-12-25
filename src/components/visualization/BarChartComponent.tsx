import React, {useCallback, useEffect, useState} from 'react';
import {useTransactionStore} from '@/store/transactionStore';
import {CategoryFilter} from './CategoryFilter';
import {ExpenseBarChart} from './ExpenseBarChart';
import {TotalExpenseChart} from './TotalExpenseChart';
import {ChartDataItem} from '@/types/chart';

const BarChartComponent: React.FC = () => {
    const {transactions} = useTransactionStore();
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [chartType, setChartType] = useState("stacked");
    const [hasSetInitialState, setHasSetInitialState] = useState(false);

    useEffect(() => {
        const uniqueCategories = Array.from(
            new Set(transactions.map(t => t.category || 'Uncategorized'))
        );
        setCategories(uniqueCategories);
        setSelectedCategories(uniqueCategories);
        setHasSetInitialState(true);
    }, [transactions]);

    const processTransactionData = useCallback(() => {
        const monthlyData = transactions.reduce((acc, transaction) => {
            const [year, month] = transaction.transactionDate.split('-');
            const monthYear = `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', {month: 'short'})} ${year.slice(2)}`;

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

    const dataFormatter = (number: number) =>
        Intl.NumberFormat('us', {
            style: 'currency',
            currency: 'USD'
        }).format(number);

    return (
        <div>
            <CategoryFilter
                chartType={chartType}
                setChartType={setChartType}
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                hasSetInitialState={hasSetInitialState}
            />
            <ExpenseBarChart
                chartData={chartData}
                chartType={chartType}
                selectedCategories={selectedCategories}
                dataFormatter={dataFormatter}
            />
            <div className="h-12"/>
            <TotalExpenseChart
                chartData={chartData}
                selectedCategories={selectedCategories}
                dataFormatter={dataFormatter}
            />
        </div>
    );
};

export default BarChartComponent;
