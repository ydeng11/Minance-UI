import React, {useMemo} from 'react';
import {BarChart} from "@/components/analytics/BarChart.tsx";
import {ChartDataItem} from "@/types/chart";

interface TotalExpenseChartProps {
    chartData: ChartDataItem[];
    selectedCategories: string[];
    dataFormatter: (number: number) => string;
}

export const TotalExpenseChart: React.FC<TotalExpenseChartProps> = ({
    chartData,
    selectedCategories,
    dataFormatter
}) => {
    const totalData = useMemo(() => {
        return chartData.map(monthData => {
            const total = selectedCategories.reduce((sum, category) => {
                return sum + (Number(monthData[category]) || 0);
            }, 0);
            
            return {
                date: monthData.date,
                total
            };
        });
    }, [chartData, selectedCategories]);

    return (
        <div className="bg-gray-100 pt-4 rounded-lg shadow-lg mt-4">
            <BarChart
                data={totalData}
                index="date"
                categories={['total']}
                className="h-52"
                valueFormatter={dataFormatter}
                showXAxis={true}
                showYAxis={true}
                yAxisWidth={100}
                showGridLines={true}
                showLegend={false}
            />
        </div>
    );
};
