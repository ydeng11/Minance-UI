import * as React from "react";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {Transaction} from "@/services/apis/types";
import {useTransactionStore} from '@/store/transactionStore';
import {useTransactionQuery} from '@/services/queries/useTransactionQuery';
import {useTransactionMutation} from '@/services/queries/useTransactionMutation';

export function ExpenseTable() {
    const gridRef = React.useRef<AgGridReact>(null);
    const {setTransactions} = useTransactionStore();
    const [selectedRows, setSelectedRows] = React.useState<Transaction[]>([]);
    const [rowData, setRowData] = React.useState<Transaction[]>([]);

    const {data: transactions, isLoading, isError} = useTransactionQuery();
    const {updateTransactionMutation, deleteTransactionMutation} = useTransactionMutation();

    React.useEffect(() => {
        if (transactions) {
            setTransactions(transactions);
            setRowData(transactions);
        }
    }, [transactions, setTransactions]);
    const onCellValueChanged = (params: any) => {
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
            valueFormatter: (params: any) => {
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
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                        rowSelection={{mode: 'multiRow'}}
                        pagination={true}
                        paginationPageSize={20}
                        suppressMenuHide={true}
                        domLayout="autoHeight"
                        onSelectionChanged={onSelectionChanged}
                        onCellValueChanged={onCellValueChanged}
                    />
                </div>
            </div>
        </div>
    );
}
