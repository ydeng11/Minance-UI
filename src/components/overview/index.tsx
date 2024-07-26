import BarChartComponent from "@/components/visualization/barChartComponent";
import {ExpenseTable} from "@/components/visualization/expenseTable";

const Overview = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Total Revenue</h2>
                    <p className="text-2xl">$45,231.89</p>
                    <p className="text-green-500">+20.1% from last month</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Subscriptions</h2>
                    <p className="text-2xl">+2350</p>
                    <p className="text-green-500">+180.1% from last month</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Sales</h2>
                    <p className="text-2xl">+12,234</p>
                    <p className="text-green-500">+19% from last month</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold">Active Now</h2>
                    <p className="text-2xl">+573</p>
                    <p className="text-green-500">+201 since last hour</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
                    <BarChartComponent/>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
                    <ExpenseTable/>
                </div>
            </div>
        </div>
    );
};

export default Overview;
