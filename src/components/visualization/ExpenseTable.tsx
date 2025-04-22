import * as React from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Transaction } from "@/services/apis/types";
import { useTransactionStore } from '@/store/transactionStore';
import { useTransactionMutation } from '@/services/queries/useTransactionMutation';
import { useDateRangeQuery } from '@/services/queries/useDateRangeQuery';
import { useDateRangeStore } from '@/store/dateRangeStore';

// Filter state storage key
const FILTER_STATE_KEY = 'expense-table-filter-state';
// Last date range key to detect actual date range changes
const LAST_DATE_RANGE_KEY = 'expense-table-last-date-range';

export function ExpenseTable() {
    const gridRef = React.useRef<AgGridReact>(null);
    const { setTransactions } = useTransactionStore();
    const dateRangeStore = useDateRangeStore();
    const [selectedRows, setSelectedRows] = React.useState<Transaction[]>([]);
    const [filterState, setFilterState] = React.useState<any>(null);
    const isInitialRender = React.useRef(true);

    const { data: transactions, isLoading, isError } = useDateRangeQuery();
    const { updateTransactionMutation, deleteTransactionMutation } = useTransactionMutation();

    // Save filter state to localStorage
    const saveFilterState = React.useCallback(() => {
        if (gridRef.current?.api) {
            const currentFilterModel = gridRef.current.api.getFilterModel();
            localStorage.setItem(FILTER_STATE_KEY, JSON.stringify(currentFilterModel));
        }
    }, []);

    // Load filter state from localStorage
    const loadFilterState = React.useCallback(() => {
        try {
            const savedState = localStorage.getItem(FILTER_STATE_KEY);
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                setFilterState(parsedState);
                return parsedState;
            }
        } catch (error) {
            console.error("Error loading filter state:", error);
            localStorage.removeItem(FILTER_STATE_KEY);
        }
        return null;
    }, []);

    // Check if date range has changed
    const hasDateRangeChanged = React.useCallback(() => {
        // Stringify the current query parameters to compare with last saved
        const currentDateRange = JSON.stringify({
            startDate: dateRangeStore.startDate,
            endDate: dateRangeStore.endDate,
        });

        const lastDateRange = localStorage.getItem(LAST_DATE_RANGE_KEY);

        // Save current date range for future comparison
        localStorage.setItem(LAST_DATE_RANGE_KEY, currentDateRange);

        // Return true if date range changed, false otherwise
        return lastDateRange !== null && lastDateRange !== currentDateRange;
    }, [dateRangeStore.startDate, dateRangeStore.endDate]);

    // Apply filter state to grid
    const applyFilterState = React.useCallback(() => {
        if (gridRef.current?.api && filterState) {
            gridRef.current.api.setFilterModel(filterState);
        }
    }, [filterState]);

    // When grid is ready
    const onGridReady = React.useCallback(() => {
        const savedFilters = loadFilterState();
        if (savedFilters && gridRef.current?.api) {
            gridRef.current.api.setFilterModel(savedFilters);
        }
    }, [loadFilterState]);

    // When transactions change, update the store
    React.useEffect(() => {
        if (transactions) {
            setTransactions(transactions);

            // Only clear filters when date range actually changes (not on page navigation)
            if (!isInitialRender.current && hasDateRangeChanged()) {
                console.log("Date range changed, clearing filters");
                localStorage.removeItem(FILTER_STATE_KEY);
                if (gridRef.current?.api) {
                    gridRef.current.api.setFilterModel(null);
                }
            }

            isInitialRender.current = false;
        }
    }, [transactions, setTransactions, hasDateRangeChanged]);

    // Apply saved filters when grid is ready and data is loaded
    React.useEffect(() => {
        if (!isLoading && gridRef.current?.api) {
            applyFilterState();
        }
    }, [isLoading, applyFilterState]);

    // Save filters when component unmounts
    React.useEffect(() => {
        return () => {
            if (gridRef.current?.api) {
                saveFilterState();
            }
        };
    }, [saveFilterState]);

    const onFilterChanged = React.useCallback(() => {
        saveFilterState();
    }, [saveFilterState]);

    const onCellValueChanged = (params: { data: Transaction }) => {
        const transaction = params.data as Transaction;
        updateTransactionMutation({
            accountId: transaction.accountId,
            transactionId: transaction.transactionId,
            transaction: transaction
        });
    };

    const deleteSelectedRows = () => {
        const transactionIds = selectedRows.map(row => row.transactionId);
        deleteTransactionMutation(transactionIds);
        setSelectedRows([]);
    };

    const [columnDefs] = React.useState([
        {
            field: 'transactionDate',
            headerName: 'Transaction Date',
            sortable: true,
            filter: true,
            editable: true,
        },
        {
            field: 'bankName',
            headerName: 'Bank',
            sortable: true,
            filter: 'agSetColumnFilter',
            editable: true,
        },
        {
            field: 'accountName',
            headerName: 'Account',
            sortable: true,
            filter: 'agSetColumnFilter',
            editable: true,
        },
        {
            field: 'category',
            headerName: 'Category',
            sortable: true,
            filter: 'agSetColumnFilter',
            editable: true,
        },
        {
            field: 'description',
            headerName: 'Description',
            sortable: true,
            filter: true,
            editable: true,
        },
        {
            field: 'amount',
            headerName: 'Amount',
            sortable: true,
            filter: true,
            editable: true,
            valueFormatter: (params: { value: number }) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(params.value);
            },
        },
    ]);

    const defaultColDef = React.useMemo(
        () => ({
            flex: 1,
            minWidth: 100,
            resizable: true,
        }),
        []
    );

    const onSelectionChanged = () => {
        const selectedRows = gridRef.current?.api.getSelectedRows() || [];
        setSelectedRows(selectedRows);
    };

    if (isLoading) {
        return <div>Loading transactions...</div>;
    }

    if (isError) {
        return <div>Error loading transactions</div>;
    }

    return (
        <div className="w-full bg-card rounded-md border border-border shadow-sm relative overflow-hidden">
            <div className="flex justify-end p-2">
                {selectedRows.length > 0 && (
                    <button
                        onClick={deleteSelectedRows}
                        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
                    >
                        Delete Selected ({selectedRows.length})
                    </button>
                )}
            </div>
            <div className="w-full overflow-x-auto">
                <div className="ag-theme-alpine w-full h-full">
                    <AgGridReact
                        ref={gridRef}
                        rowData={transactions}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                        rowSelection={{ mode: 'multiRow' }}
                        pagination={true}
                        paginationPageSize={20}
                        suppressMenuHide={true}
                        domLayout="autoHeight"
                        onSelectionChanged={onSelectionChanged}
                        onCellValueChanged={onCellValueChanged}
                        onGridReady={onGridReady}
                        onFilterChanged={onFilterChanged}
                    />
                </div>
            </div>
        </div>
    );
}
