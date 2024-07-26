import React from 'react';
import {Route, Routes} from "react-router-dom";
import Header from "@/components/header";
import Overview from "@/components/overview";
import Analytics from "@/components/analytics";
import Settings from "@/components/settings";

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header/>
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/overview" element={<Overview/>}/>
                    <Route path="/analytics" element={<Analytics/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/" element={<Overview/>}/>
                </Routes>
            </main>
        </div>
    );
};

export default Layout;