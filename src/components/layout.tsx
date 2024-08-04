import React from 'react';
import {Route, Routes} from "react-router-dom";
import Analytics from "@/components/analytics";
import Settings from "@/components/settings/Settings.tsx";
import CatGroupingComponent from "@/components/settings/CatGroupingComponent.tsx";
import Overview from "@/components/Overview.tsx";
import Header from "@/components/Header.tsx";
import {AccountManager} from "@/components/settings/AccountManager.tsx";

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header/>
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/overview" element={<Overview/>}/>
                    <Route path="/analytics" element={<Analytics/>}/>
                    <Route path="/settings" element={<Settings/>}>
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