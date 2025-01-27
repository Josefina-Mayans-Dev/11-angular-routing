export interface AccountRequest {
    customerId?: string;
    accountNumber: string;
    initialBalance: number;
    owner: string;
}

export interface AccountResponse {
    customerId: string;
    accountId: string;
    owner: string;
    accountNumber: string;
    balance: number;
    status:string;
}