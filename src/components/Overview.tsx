import {ExpenseTable} from "@/components/visualization/ExpenseTable.tsx";


const Overview = () => {
    return (
        <div className="pt-4 bg-gray-50">
            {/* TODO: Dashboard Cards */}
            {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">*/}
            {/*    <div className="bg-white p-4 rounded-lg shadow">*/}
            {/*        <h2 className="text-lg text-gray-700 font-semibold">Total Expenses</h2>*/}
            {/*        <p className="text-2xl text-gray-900">$45,231.89</p>*/}
            {/*        <p className="text-green-500">+20.1% from last month</p>*/}
            {/*    </div>*/}
            {/*    <div className="bg-white p-4 rounded-lg shadow">*/}
            {/*        <h2 className="text-lg text-gray-700 font-semibold">Credit</h2>*/}
            {/*        <p className="text-2xl text-gray-900">+2350</p>*/}
            {/*        <p className="text-green-500">+180.1% from last month</p>*/}
            {/*    </div>*/}
            {/*    <div className="bg-white p-4 rounded-lg shadow">*/}
            {/*        <h2 className="text-lg text-gray-700 font-semibold">Debit</h2>*/}
            {/*        <p className="text-2xl text-gray-900">+12,234</p>*/}
            {/*        <p className="text-green-500">+19% from last month</p>*/}
            {/*    </div>*/}
            {/*    <div className="bg-white p-4 rounded-lg shadow">*/}
            {/*        <h2 className="text-lg text-gray-700 font-semibold">Transactions</h2>*/}
            {/*        <p className="text-2xl text-gray-900">+573</p>*/}
            {/*        <p className="text-green-500">+201 since last hour</p>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Recent Expenses */}
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg text-gray-700 font-semibold mb-4">Recent Expenses</h2>
                    <ExpenseTable/>
                </div>
            </div>
        </div>
    );
};


export default Overview;
