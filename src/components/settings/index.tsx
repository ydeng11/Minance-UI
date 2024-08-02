// Settings.tsx
import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import CatMapping from "@/components/settings/catMapping";

const Settings: React.FC = () => {
    return (
        <Router>
            <div className="flex h-screen bg-gray-900 text-white">
                <div className="w-1/5 bg-gray-800 p-4">
                    <nav className="flex flex-col space-y-2">
                        <Link to="/settings/cat-mapping" className="p-2 hover:bg-gray-700 rounded">
                            Cat Mapping
                        </Link>
                    </nav>
                </div>
                <div className="w-4/5 p-4">
                    <Routes>
                        <Route path="/settings/cat-mapping" element={<CatMapping/>}/>
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default Settings;
