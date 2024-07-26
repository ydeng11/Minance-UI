import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navigation from "@/components/navigation";
import Overview from "@/components/overview";
import Analytics from "@/components/analytics";
import Settings from "@/components/settings";

const Layout: React.FC = () => {
    return (
        <BrowserRouter>
            <div>
                <Navigation/>
                <main>
                    <Routes>
                        <Route path="/overview" element={<Overview/>}/>
                        <Route path="/analytics" element={<Analytics/>}/>
                        <Route path="/settings" element={<Settings/>}/>
                        <Route path="/" element={<Overview/>}/>
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};

export default Layout;