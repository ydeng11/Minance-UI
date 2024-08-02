import React from 'react';
import {NavLink} from 'react-router-dom';
import {NavigationMenu, NavigationMenuItem, NavigationMenuList,} from "@/components/ui/navigation-menu.tsx"; // Import from ShadCN

const Navigation: React.FC = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavLink to="/overview" className={({isActive}) => isActive ? "active-link" : "inactive-link"}>
                        Overview
                    </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavLink to="/analytics" className={({isActive}) => isActive ? "active-link" : "inactive-link"}>
                        Analytics
                    </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavLink to="/settings" className={({isActive}) => isActive ? "active-link" : "inactive-link"}>
                        Settings
                    </NavLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default Navigation;