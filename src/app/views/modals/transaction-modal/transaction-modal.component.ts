import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionFormComponent } from '../../transactions/transaction-form/transaction-form.component';

@Component({
  selector: 'app-transaction-modal',
  imports: [TransactionFormComponent],
  templateUrl: './transaction-modal.component.html',
  styleUrl: './transaction-modal.component.scss'
})
export class TransactionModalComponent {
  @Input() accountNumber: string | null = null;
  @Input() balance: number | null = null;

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

}
