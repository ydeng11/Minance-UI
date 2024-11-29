export interface Account {
    accountId: string;
    bankId: string;
    bankName: string;
    accountName: string;
    accountType: string;
    initBalance: string;
}

export interface TransactionsUploadForm {
    bankName: string;
    accountName: string;
    useMinanceFormat: string;
}

export interface Transaction {
    transactionId: number;
    accountId: number;
    category: string;
    description: string;
    transactionType: string;
    transactionDate: string;
    postDate: string;
    memo: string;
    address: string;
    city: string;
    stateName: string;
    country: string;
    zipcode: string;
    amount: number;
    bankName: string;
    accountName: string;
    uploadTime: string;
    isDuplicate: number;
}