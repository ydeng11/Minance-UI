import React from 'react';
import {Route, Routes} from "react-router-dom";
import CatGroupingComponent from "@/components/settings/CatGroupingComponent.tsx";
import Overview from "@/components/Overview.tsx";
import Header from "@/components/Header.tsx";
import {AccountManager} from "@/components/settings/AccountManager.tsx";
import Visualization from "@/components/visualization";

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-white">
            <Header/>
            <main className="container mx-auto pt-4">
                <Routes>
                    <Route path="/overview" element={<Overview/>}/>
                    <Route path="/visualization" element={<Visualization/>}/>
                    <Route path="/settings">
                        <Route path="" element={<CatGroupingComponent/>}/>
                        <Route path="cat-grouping" element={<CatGroupingComponent/>}/>
                        <Route path="new-bank-account" element={<AccountManager/>}/>
                    </Route>
                    <Route path="/" element={<Overview/>}/>
                </Routes>
            </main>
        </div>
    );
};

export default Layout;