import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { AccountResponse } from '../../../interfaces/account.interface';


@Component({
    selector: 'app-account-list',
    imports: [],
    templateUrl: './accounts-list.component.html',
    styleUrl: './accounts-list.component.scss'
})
export class AccountListComponent implements OnInit, OnDestroy {
    accounts: AccountResponse[] = [];
    selectedAccount: string | null = null;
    private destroy$ = new Subject<void>();

    constructor(private accountService: AccountService, private router: Router) {
        this.accountService.accountUpdated$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.loadAccounts())
            )
            .subscribe();
    }


    ngOnInit(): void {
        this.loadAccounts()
            .subscribe()
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


    loadAccounts() {
        return this.accountService.getAllAccounts()
            .pipe(
                takeUntil(this.destroy$),
                tap(accounts => {
                    this.accounts = accounts;
                })
            );

    }


    showDetails(accountNumber: string): void {
        this.selectedAccount = accountNumber;
        this.router.navigate(['/dashboard/account-detail'], { queryParams: { accountNumber: accountNumber } })
            .then(() => { });
    }
}