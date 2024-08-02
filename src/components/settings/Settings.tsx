import React from 'react';
import {Link, Outlet} from 'react-router-dom';

const Settings: React.FC = () => {
    return (
        <div className="flex bg-gray-900 text-white min-h-screen">
            <div className="w-1/5 bg-gray-800 p-4 flex flex-col justify-between h-auto" style={{height: '500px'}}>
                <nav className="flex flex-col space-y-2 p-6">
                    <Link to="/settings/cat-mapping"
                          className="flex justify-center p-2 hover:bg-gray-700 rounded text-white font-semibold text-lg transition duration-300 ease-in-out transform hover:scale-105">
                        Cat Grouping
                    </Link>
                </nav>
            </div>
            <div className="w-4/5 p-4 pt-8 flex-1">
                <Outlet/>
            </div>
        </div>
    );
};

export default Settings;
