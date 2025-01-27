import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subject, switchMap, takeUntil, tap, of } from 'rxjs';
import { TransactionResponse } from '../../../interfaces/transaction.interface';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-history',
  imports: [FormsModule, DatePipe],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent implements OnInit, OnDestroy {
  transactions: TransactionResponse[] = [];
  selectedAccountNumber: string = '';
  private destroy$ = new Subject<void>();


  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.filterTransactions().subscribe();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterTransactions() {
    return of(this.selectedAccountNumber)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((accountNumber) => {
          if (!accountNumber) {
            this.transactions = [];
            return of([]);
          }
          return this.transactionService.getTransactions(accountNumber)
            .pipe(
              tap(transactionResponses => {
                this.transactions = Array.isArray(transactionResponses[0])
                  ? transactionResponses[0]
                  : transactionResponses;
              })
            )
        })
      )
  }


  searchByAccountNumber(): void {
    this.filterTransactions().subscribe()
  }
}