"use client"

import * as React from "react"
import {DotsHorizontalIcon} from "@radix-ui/react-icons"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle,} from '@/components/ui/dialog';
import uuid from "react-uuid";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";

interface Account {
    id: string;
    bank: string;
    account: string;
    type: string;
}

const initialData: Account[] = [
    {id: uuid(), bank: 'Bank A', account: '12345678', type: 'Savings'},
    {id: uuid(), bank: 'Bank B', account: '87654321', type: 'Checking'},
    {id: uuid(), bank: 'Bank C', account: '56789012', type: 'Savings'},
]

export const columns: ColumnDef<Account>[] = [
    {
        accessorKey: "bank",
        header: "Bank",
        cell: ({row}) => (
            <div>{row.getValue("bank")}</div>
        ),
    },
    {
        accessorKey: "account",
        header: "Account",
        cell: ({row}) => <div>{row.getValue("account")}</div>,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({row}) => (
            <div>{row.getValue("type")}</div>
        ),
    },
    {
        id: "actions",
        cell: ({row}) => {
            const account = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => (account)}
                        >
                            Modify
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => (account.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function AccountManager() {
    const [accounts, setAccounts] = React.useState<Account[]>(initialData)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
    const [newAccount, setNewAccount] = React.useState<Account>({id: '', bank: '', account: '', type: ''});

    const table = useReactTable({
        data: accounts,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const addAccount = () => {
        const accountWithId = {...newAccount, id: uuid()};
        setAccounts([...accounts, accountWithId]);
        setIsDialogOpen(false);
        setNewAccount({id: '', bank: '', account: '', type: ''});
    };

    // const deleteAccount = (id: string) => {
    //     setAccounts(accounts.filter(account => account.id !== id));
    // };
    //
    // const modifyAccount = (account: Account) => {
    //     // Modify account logic here
    // };

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            <div className="flex items-center py-2">
                <Input
                    placeholder="Filter accounts..."
                    value={(table.getColumn("account")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("account")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Button variant="outline" className="ml-auto" onClick={() => setIsDialogOpen(true)}>
                    Add New
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogOverlay className="bg-black bg-opacity-75 fixed inset-0"/>
                <DialogContent className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-md mx-auto my-16">
                    <DialogTitle className="text-xl font-semibold text-gray-100">Add New Account</DialogTitle>
                    <DialogDescription>
                        <form className="space-y-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Bank</label>
                                <input
                                    type="text"
                                    value={newAccount.bank}
                                    onChange={(e) => setNewAccount({...newAccount, bank: e.target.value})}
                                    className="mt-1 block w-full border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-100 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Account</label>
                                <input
                                    type="text"
                                    value={newAccount.account}
                                    onChange={(e) => setNewAccount({...newAccount, account: e.target.value})}
                                    className="mt-1 block w-full border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-100 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Type</label>
                                <input
                                    type="text"
                                    value={newAccount.type}
                                    onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
                                    className="mt-1 block w-full border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-100 p-2"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={addAccount}
                                        className="h-10 bg-indigo-600 text-white rounded-md px-4 hover:bg-indigo-700">
                                    Add Account
                                </Button>
                            </div>
                        </form>
                    </DialogDescription>
                </DialogContent>
            </Dialog>


        </div>
    )
}
