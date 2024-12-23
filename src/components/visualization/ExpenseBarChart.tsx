import React from 'react';
import {BarChart} from "@/components/analytics/BarChart.tsx";
import {ChartDataItem} from "@/types/chart";

interface ExpenseBarChartProps {
    chartData: ChartDataItem[];
    chartType: string;
    selectedCategories: string[];
    dataFormatter: (number: number) => string;
}

export const ExpenseBarChart: React.FC<ExpenseBarChartProps> = ({
    chartData,
    chartType,
    selectedCategories,
    dataFormatter
}) => {
    return (
        <div className="bg-gray-100 pt-4 rounded-lg shadow-lg">
            <BarChart
                data={chartData}
                type={chartType as "default" | "percent" | "stacked" | undefined}
                index="date"
                className="h-52 mb-8"
                categories={selectedCategories}
                valueFormatter={dataFormatter}
                showXAxis={true}
                showYAxis={true}
                yAxisWidth={100}
                showGridLines={true}
                showLegend={true}
            />
        </div>
    );
};
