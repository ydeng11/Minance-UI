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
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle,} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Account} from "@/services/apis/types.tsx";
import {useAccountMutation} from "@/services/queries/useAccountMutation.tsx";
import {useAccountsQuery} from "@/services/queries/useAccountQueries.tsx";
import { useAccountOptionsQuery } from "@/services/queries/useAccountOptionsQuery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export const columns: ColumnDef<Account>[] = [
    {
        accessorKey: "bankName",
        header: "Bank",
        cell: ({row}) => (
            <div>{row.getValue("bankName")}</div>
        ),
    },
    {
        accessorKey: "accountName",
        header: "Account",
        cell: ({row}) => <div>{row.getValue("accountName")}</div>,
    },
    {
        accessorKey: "accountType",
        header: "Type",
        cell: ({row}) => (
            <div>{row.getValue("accountType")}</div>
        ),
    },
    {
        accessorKey: "initBalance",
        header: "Balance",
        cell: ({row}) => (
            <div>{row.getValue("initBalance")}</div>
        ),
    }
]

export function AccountManager() {
    const {data} = useAccountsQuery();
    const {createAccountMutation, updateAccountMutation, deleteAccountMutation} = useAccountMutation();
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    React.useEffect(() => {
        if (data) {
            setAccounts(data);
        }
    }, [data]);
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
    const [newAccount, setNewAccount] = React.useState({
        accountId: '',
        bankId: '',
        bankName: '',
        accountName: '',
        accountType: '',
        initBalance: ''
    });
    const [isModifying, setIsModifying] = React.useState(false);
    const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null);
    const { supportedBanks, supportedAccountTypes, isLoading: isLoadingOptions } = useAccountOptionsQuery();

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            createAccountMutation(newAccount);
            setIsDialogOpen(false);
            setNewAccount({
                accountId: '',
                bankId: '',
                bankName: '',
                accountName: '',
                accountType: '',
                initBalance: ''
            });
        } catch (error) {
            console.error('Failed to create account:', error);
        }
    };

    const handleModifyAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAccount) return;

        try {
            updateAccountMutation({
                ...newAccount,
                accountId: selectedAccount.accountId
            });
            setIsDialogOpen(false);
            setIsModifying(false);
            setSelectedAccount(null);
            setNewAccount({
                accountId: '',
                bankId: '',
                bankName: '',
                accountName: '',
                accountType: '',
                initBalance: ''
            });
        } catch (error) {
            console.error('Failed to update account:', error);
        }
    };

    const handleDeleteAccount = async (accountId: string) => {
        try {
            await deleteAccountMutation({accountId});
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    const openModifyDialog = (account: Account) => {
        setSelectedAccount(account);
        setNewAccount({
            accountId: '',
            bankId: account.bankId,
            bankName: account.bankName,
            accountName: account.accountName,
            accountType: account.accountType,
            initBalance: account.initBalance
        });
        setIsModifying(true);
        setIsDialogOpen(true);
    };

    const actionsColumn: ColumnDef<Account> = {
        id: "actions",
        cell: ({row}) => {
            const account: Account = row.original;
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
                            onClick={() => openModifyDialog(account)}
                            className="cursor-pointer"
                        >
                            Modify
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDeleteAccount(account.accountId)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    };

    const table = useReactTable({
        data: accounts,
        columns: [...columns, actionsColumn],
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

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            <div className="flex items-center justify-center h-full">
                <h1 className="scroll-m-20 text-4xl text-gray-500 font-extrabold tracking-tight lg:text-5xl text-center">
                    Account Manager
                </h1>
            </div>
            <div className="flex items-center py-2">
                <Button
                    variant="outline"
                    className="ml-auto text-black border-gray-500 hover:bg-gray-100 hover:border-gray-700 focus:ring-2 focus:ring-gray-300 transition-colors"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Add New
                </Button>
            </div>
            <div className="rounded-md border">
                <Table className="text-black">
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
                <DialogOverlay className="bg-gray-500 bg-opacity-75 fixed inset-0"/>
                <DialogContent className="bg-gray-300 rounded-lg p-6 shadow-lg max-w-md mx-auto my-16">
                    <DialogTitle className="text-xl font-semibold text-black">
                        {isModifying ? 'Modify Account' : 'Add New Account'}
                    </DialogTitle>
                    <DialogDescription>
                        <form className="space-y-4 mt-4"
                              onSubmit={isModifying ? handleModifyAccount : handleAddAccount}>
                            <div>
                                <label className="block text-sm font-medium text-black">Bank</label>
                                <Select
                                    value={newAccount.bankName}
                                    onValueChange={(value: string) => setNewAccount({...newAccount, bankName: value})}
                                >
                                    <SelectTrigger className="mt-1 w-full bg-gray-200">
                                        <SelectValue placeholder="Select a bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {supportedBanks.data?.map((bank) => (
                                            <SelectItem key={bank} value={bank}>
                                                {bank}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Account</label>
                                <input
                                    type="text"
                                    value={newAccount.accountName}
                                    onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Type</label>
                                <Select
                                    value={newAccount.accountType}
                                    onValueChange={(value: string) => setNewAccount({...newAccount, accountType: value})}
                                >
                                    <SelectTrigger className="mt-1 w-full bg-gray-200">
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {supportedAccountTypes.data?.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Balance</label>
                                <input
                                    type="text"
                                    value={newAccount.initBalance}
                                    onChange={(e) => setNewAccount({...newAccount, initBalance: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black p-2"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="h-10 bg-indigo-600 text-white rounded-md px-4 hover:bg-indigo-700"
                                    disabled={isLoadingOptions}
                                >
                                    {isModifying ? 'Update Account' : 'Add Account'}
                                </Button>
                            </div>
                        </form>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )
}
