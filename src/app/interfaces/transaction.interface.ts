export interface TransactionRequest {
    accountNumber: string;
    amount: number;
    transactionType: string;
}

export interface TransactionResponse {
    transactionId: string;
    accountId: string;
    transactionCost: number;
    amount: number;
    date: string;
    transactionType: string;
}