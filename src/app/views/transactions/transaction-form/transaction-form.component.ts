import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionRequest } from '../../../interfaces/transaction.interface';
import { TransactionService } from '../../../services/transaction.service';
import { TransactionType } from '../../../interfaces/transaction-type.enum';

@Component({
  selector: 'app-transaction-form',
  imports: [FormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent {
  @Input() accountNumber: string | null = null;
  @Input() balance: number | null = null;
  @Output() close = new EventEmitter<void>();
  errorMessage: string | null = null;

  selectedType = TransactionType.ATM_DEPOSIT;
  transactionOptions = [
    { value: TransactionType.BRANCH_DEPOSIT, label: 'Branch deposit (0$)' },
    { value: TransactionType.ATM_DEPOSIT, label: 'ATM deposit (2$)' },
    { value: TransactionType.OTHER_ACCOUNT_DEPOSIT, label: 'Deposit from another account (1.5$)' },
    { value: TransactionType.PHYSICAL_PURCHASE, label: 'Physical purchase (0$)' },
    { value: TransactionType.ONLINE_PURCHASE, label: 'Online purchase (5$)' },
    { value: TransactionType.ATM_WITHDRAWAL, label: 'ATM withdrawal (1$)' },

  ];


  transactionData: TransactionRequest = {
    accountNumber: '',
    amount: 0,
    transactionType: ''
  };


  transactionCost: number = 0;

  showConfirmationDialog: boolean = false;

  constructor(private transactionService: TransactionService) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['accountNumber']) {
      if (this.accountNumber) {
        this.transactionData = {
          accountNumber: this.accountNumber,
          amount: 0,
          transactionType: ''
        };
        this.errorMessage = null;
      }
    }

    if (changes['balance'] && this.balance != null) {
      this.balance = changes['balance'].currentValue;
    }
  }


  calculateTransactionCost() {
    this.transactionCost = 0;

    switch (this.transactionData.transactionType) {
      case TransactionType.ATM_DEPOSIT:
        this.transactionCost = 2;
        break;
      case TransactionType.OTHER_ACCOUNT_DEPOSIT:
        this.transactionCost = 1.5;
        break;
      case TransactionType.ONLINE_PURCHASE:
        this.transactionCost = 5;
        break;
      case TransactionType.ATM_WITHDRAWAL:
        this.transactionCost = 1;
        break;
    }
  }


  submitForm() {
    this.showConfirmationDialog = true;
  }

  confirmTransaction(confirmed: boolean) {
    this.showConfirmationDialog = false;
    if (confirmed) {
      if ((this.transactionData.transactionType === TransactionType.ATM_DEPOSIT)
        || (this.transactionData.transactionType === TransactionType.BRANCH_DEPOSIT)
        || (this.transactionData.transactionType === TransactionType.OTHER_ACCOUNT_DEPOSIT)
      ) {
        this.makeDeposit();
      } else {
        this.makeWithdrawal();
      }
    }
  }

  makeDeposit() {
    if (this.balance === null || this.balance === undefined) {
      this.errorMessage = 'No se pudo obtener el balance de la cuenta';
      return;
    }

    const balanceWithAmount = this.balance + this.transactionData.amount;

    if (this.transactionCost > balanceWithAmount) {

      this.errorMessage = 'Transaction amount + fee cannot exceed balance'
      return
    }

    this.transactionService.createDeposit(this.transactionData).subscribe({
      next: () => {
        this.transactionService.notifyTransactionCreated(this.transactionData.accountNumber);
        this.close.emit();

      },
      error: (error: any) => {
        if (error && error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Ocurrió un error inesperado';
        }
      }
    });
  }

  makeWithdrawal() {
    const amountWithCost = this.transactionData.amount + this.transactionCost;
    if (this.balance === null || this.balance === undefined) {
      this.errorMessage = 'No se pudo obtener el balance de la cuenta';
      return;
    }

    if (amountWithCost > this.balance) {
      this.errorMessage = 'Transaction amount + fee cannot exceed balance'
      return
    }


    this.transactionService.createWithdrawal(this.transactionData).subscribe({
      next: () => {
        this.transactionService.notifyTransactionCreated(this.transactionData.accountNumber);
        this.close.emit();
      },
      error: (error: any) => {
        if (error && error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Ocurrió un error inesperado';
        }
      }
    });
  }

}
