// Header.tsx
import React from 'react';
import {NavLink} from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css'; // Basic styles
// Custom styles for the date picker
import {DateRangePicker} from "@/components/utils/datePicker/date-range-picker.tsx";
import ImportTransactions from "@/components/utils/ImportTransactionModal.tsx";

const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 shadow-lg">
            <div className="flex items-center">
                <div className="text-2xl font-bold">Miance</div>
                <nav className="ml-10 space-x-4">
                    <NavLink to="/overview"
                             className={({isActive}) => isActive ? "text-white" : "text-gray-400 hover:text-white"}>
                        Overview
                    </NavLink>
                    <NavLink to="/analytics"
                             className={({isActive}) => isActive ? "text-white" : "text-gray-400 hover:text-white"}>
                        Analytics
                    </NavLink>
                    <NavLink to="/settings"
                             className={({isActive}) => isActive ? "text-white" : "text-gray-400 hover:text-white"}>
                        Settings
                    </NavLink>
                </nav>
            </div>
            <div className="flex items-center space-x-2">
                <DateRangePicker
                    onUpdate={(values) => console.log(values)}
                    initialDateFrom="2023-01-01"
                    initialDateTo="2023-12-31"
                    align="start"
                    showCompare={false}
                />
                <ImportTransactions/>
                {/*<img src="path-to-avatar" alt="User Avatar" className="w-10 h-10 rounded-full"/>*/}
            </div>
        </header>
    );
};

export default Header;
