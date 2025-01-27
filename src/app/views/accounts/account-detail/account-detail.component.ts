import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap, of, delay, combineLatest, map, Observable } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { AccountResponse } from '../../../interfaces/account.interface';
import { TransactionResponse } from '../../../interfaces/transaction.interface';
import { TransactionModalComponent } from '../../modals/transaction-modal/transaction-modal.component';
import { TransactionsTableComponent } from '../../transactions/transactions-table/transactions-table.component';

@Component({
    selector: 'app-account-detail',
    imports: [TransactionModalComponent, TransactionsTableComponent],
    templateUrl: './account-detail.component.html',
    styleUrl: './account-detail.component.scss'
})
export class AccountDetailComponent implements OnInit, OnDestroy {
    accountNumber: string | null = null;
    account: AccountResponse | null = null;
    balance: number | null = null;
    transactions: TransactionResponse[] = [];
    displayedTransactions: TransactionResponse[] = [];
    currentPage = 1;
    itemsPerPage = 6;
    totalPages = 1;
    showTransactionForm = false;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private transactionService: TransactionService
    ) {
        this.transactionService.transactionCreatedSource$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => of(null).pipe(delay(1000))),
                switchMap(() => this.loadAccountDetails())
            )
            .subscribe();


        this.accountService.accountUpdated$
            .pipe(takeUntil(this.destroy$))
            .subscribe((accounts) => {
                if (this.account && accounts) {
                    const updatedAccount = accounts.find(acc => acc.accountNumber === this.account?.accountNumber);
                    if (updatedAccount) {
                        this.balance = updatedAccount.balance;
                    }
                }
            });
    }

    ngOnInit(): void {
        this.route.queryParams
            .pipe(
                takeUntil(this.destroy$),
                tap(params => {
                    this.accountNumber = params['accountNumber'];
                    if (!this.accountNumber) {
                        this.router.navigate(['/dashboard/accounts']);
                    }
                }),
                switchMap(() => this.loadAccountDetails())
            )
            .subscribe();
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadAccountDetails(): Observable<void> {
        if (!this.accountNumber) {
            return of();
        }

        return combineLatest([
            this.accountService.getAccount(this.accountNumber),
            this.transactionService.getTransactions(this.accountNumber)
        ]).pipe(
            takeUntil(this.destroy$),
            tap(([accountResponse, transactionResponses]) => {
                this.account = accountResponse;
                this.balance = accountResponse.balance;
                this.transactions = Array.isArray(transactionResponses[0])
                    ? transactionResponses[0]
                    : transactionResponses;
                this.totalPages = Math.ceil(this.transactions.length / this.itemsPerPage);
                this.updateDisplayedTransactions();
            })
        ).pipe(map(() => { }));
    }

    updateDisplayedTransactions(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.displayedTransactions = this.transactions.slice(startIndex, startIndex + this.itemsPerPage);
    }

    openTransactionForm(): void {
        this.showTransactionForm = true;
    }

    closeTransactionForm(): void {
        this.showTransactionForm = false;
    }
}