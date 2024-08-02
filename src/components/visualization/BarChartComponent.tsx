// BarChartComponent.tsx
import React from 'react';
import {BarChart} from '@tremor/react';

const data = [
    {month: 'Jan', value: 4500},
    {month: 'Feb', value: 3200},
    {month: 'Mar', value: 4100},
    {month: 'Apr', value: 1800},
    {month: 'May', value: 6000},
    {month: 'Jun', value: 5800},
    {month: 'Jul', value: 1200},
    {month: 'Aug', value: 4300},
    {month: 'Sep', value: 2400},
    {month: 'Oct', value: 3600},
    {month: 'Nov', value: 2200},
    {month: 'Dec', value: 5000},
];

const BarChartComponent: React.FC = () => {
    const dataFormatter = (number: number) =>
        Intl.NumberFormat('us').format(number).toString();

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <BarChart
                className="mt-6"
                data={data}
                index="month"           // The key in the data to use for x-axis labels
                categories={['value']} // The data fields to use for the bar heights
                colors={['blue']}   // Customize bar colors
                valueFormatter={dataFormatter} // Format values
                showXAxis={true}       // Show or hide the X axis
                showYAxis={true}       // Show or hide the Y axis
                showGridLines={true}   // Show or hide grid lines
                showLegend={false}
                onValueChange={(v) => console.log(v)}
            />
        </div>
    );
};

export default BarChartComponent;
