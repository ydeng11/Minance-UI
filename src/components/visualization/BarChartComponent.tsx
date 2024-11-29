// BarChartComponent.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {BarChart} from "@/components/analytics/BarChart.tsx";
import {useTransactionStore} from '@/store/transactionStore';
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";
import {MultiSelect} from "@/components/ui/multi-select";

const BarChartComponent: React.FC = () => {
    const {transactions} = useTransactionStore();
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [chartData, setChartData] = useState<Record<string, any>[]>([]);
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
            const date = new Date(transaction.transactionDate);
            const monthYear = date.toLocaleString('default', {month: 'short', year: '2-digit'});

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

    const categoryOptions = categories.map(category => ({
        label: category,
        value: category,
    }));

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <RadioGroup
                    defaultValue="stacked"
                    className="flex space-x-4"
                    onValueChange={setChartType}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percent" id="percent"/>
                        <Label htmlFor="percent" className="text-gray-900 font-medium">Use Percentage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stacked" id="stacked"/>
                        <Label htmlFor="stacked" className="text-gray-900 font-medium">Use Stack</Label>
                    </div>
                </RadioGroup>

                {hasSetInitialState && (
                    <MultiSelect
                        options={categoryOptions}
                        onValueChange={setSelectedCategories}
                        defaultValue={selectedCategories}
                        placeholder="Select categories"
                        variant="inverted"
                        animation={2}
                        maxCount={5}
                    />
                )}
            </div>
            <div className="bg-gray-100 pt-4 rounded-lg shadow-lg">
                <BarChart
                    data={chartData}
                    type={chartType as "default" | "percent" | "stacked" | undefined}
                    index="date"
                    className="h-52"
                    categories={selectedCategories}
                    valueFormatter={dataFormatter}
                    showXAxis={true}
                    showYAxis={true}
                    yAxisWidth={100}
                    showGridLines={true}
                    showLegend={true}
                />
            </div>
        </div>
    );
};

export default BarChartComponent;
