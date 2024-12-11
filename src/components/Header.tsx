// Header.tsx
import React from 'react';
import {NavLink} from 'react-router-dom';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {cn} from "@/lib/utils"
import {CreditCard, LucideProps, Tags} from 'lucide-react' // Import icons
import 'react-datepicker/dist/react-datepicker.css'; // Basic styles
// Custom styles for the date picker
import {DateRangePicker} from "@/components/utils/datePicker/date-range-picker.tsx";
import ImportTransactions from "@/components/utils/ImportTransactionModal.tsx";
import {useDateRangeStore} from "@/store/dateRangeStore";

interface NavListItemProps extends React.ComponentPropsWithoutRef<"a"> {
    to: string,
    title: string,
    className?: string,
    children?: React.ReactNode,
    icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

const NavListItem = React.forwardRef<
    React.ElementRef<"a">,
    NavListItemProps
>(({to, className, title, children, icon: Icon, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <NavLink
                    to={to}
                    ref={ref as React.Ref<HTMLAnchorElement>} // Typecasting ref to HTMLAnchorElement
                    className={({isActive}) =>
                        cn(
                            "flex items-start gap-4 text-base font-semibold leading-none hover:text-accent-foreground transition-colors",
                            isActive ? "text-accent-foreground" : "text-muted-foreground",
                            className
                        )
                    }
                    {...props}
                >
                    {Icon && <Icon className="h-5 w-5 text-muted-foreground"/>} {/* Render the icon */}
                    <div className="flex flex-col">
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </div>
                </NavLink>
            </NavigationMenuLink>
        </li>
    );
});
NavListItem.displayName = "NavListItem";

const Header: React.FC = () => {
    const setDateRange = useDateRangeStore((state: { setDateRange: any; }) => state.setDateRange);

    return (
        <header className="flex items-center justify-between p-4 bg-card shadow-lg">
            <div className="flex items-center">
                <div className="text-2xl font-bold text-foreground">Miance</div>
                <NavigationMenu>
                    <NavigationMenuList className="ml-10 flex space-x-4">
                        <NavigationMenuItem>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                <NavLink
                                    to="/overview"
                                    end
                                    className={({isActive}) => cn(
                                        "text-base font-semibold leading-none hover:text-accent-foreground transition-colors",
                                        isActive ? "text-accent-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    Overview
                                </NavLink>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                <NavLink
                                    to="/visualization"
                                    end
                                    className={({isActive}) => cn(
                                        "text-base font-semibold leading-none hover:text-accent-foreground transition-colors",
                                        isActive ? "text-accent-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    Visualization
                                </NavLink>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger
                                className={cn(
                                    "text-base font-semibold leading-none hover:text-accent-foreground transition-colors",
                                    "text-muted-foreground ml-0"
                                )}
                            >
                                Settings
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    <NavListItem
                                        to="/settings/cat-grouping"
                                        title="Category Grouping"
                                        icon={Tags}
                                    >
                                        Manage and organize your transaction categories efficiently
                                    </NavListItem>
                                    <NavListItem
                                        to="/settings/new-bank-account"
                                        title="AccountApis Manager"
                                        icon={CreditCard}
                                    >
                                        Add and manage your connected bank accounts
                                    </NavListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div className="flex items-center text-black space-x-2">
                <DateRangePicker
                    onUpdate={({range}) => {
                        if (range.from && range.to) {
                            setDateRange(range.from.toISOString().split('T')[0], range.to.toISOString().split('T')[0]);
                        }
                    }}
                    initialDateFrom="2024-01-01"
                    initialDateTo="2024-12-31"
                    align="start"
                    showCompare={false}
                />
                <ImportTransactions/>
            </div>
        </header>
    );
};


export default Header;
