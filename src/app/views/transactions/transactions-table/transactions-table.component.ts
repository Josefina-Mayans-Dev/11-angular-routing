import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TransactionResponse } from '../../../interfaces/transaction.interface';
import { TransactionService } from '../../../services/transaction.service';

@Component({
    selector: 'app-transactions-table',
    imports: [DatePipe],
    templateUrl: './transactions-table.component.html',
    styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit, OnDestroy {
    accountNumber: string | null = null;
    transactions: TransactionResponse[] = [];
    displayedTransactions: TransactionResponse[] = [];
    currentPage = 1;
    itemsPerPage = 6;
    totalPages = 1;
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private transactionService: TransactionService
    ) {
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
                switchMap(() => this.loadTransactions())
            )
            .subscribe();


        this.transactionService.transactionCreatedSource$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => {
                    return this.loadTransactions().pipe(
                        tap(() => {
                          if (this.currentPage < this.totalPages) {
                             this.currentPage = this.totalPages;
                            this.updateDisplayedTransactions();
                        }
                         })
                     )
                     })
              )
              .subscribe();
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


    loadTransactions() {
        if (!this.accountNumber) {
            return of();
        }
        return this.transactionService.getTransactions(this.accountNumber)
            .pipe(
                takeUntil(this.destroy$),
                tap(transactionResponses => {
                    this.transactions = Array.isArray(transactionResponses[0])
                        ? transactionResponses[0]
                        : transactionResponses;
                    this.totalPages = Math.ceil(this.transactions.length / this.itemsPerPage);
                    this.updateDisplayedTransactions();
                })
            )

    }


    updateDisplayedTransactions(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.displayedTransactions = this.transactions.slice(startIndex, startIndex + this.itemsPerPage);
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateDisplayedTransactions();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateDisplayedTransactions();
        }
    }

}