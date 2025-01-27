import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { TransactionRequest, TransactionResponse } from '../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = 'http://localhost:8080/api/v1';

  private transactionCreatedSource = new Subject<TransactionResponse[]>();

  transactionCreatedSource$ = this.transactionCreatedSource.asObservable();


  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTransactions(accountNumber: string): Observable<TransactionResponse[]> {
    return this.http.post<TransactionResponse[]>(`${this.apiUrl}/transactions/accountNumber`, { accountNumber }, { headers: this.getHeaders() });
  }

  createDeposit(transactionData: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.apiUrl}/transactions/deposit`, transactionData, { headers: this.getHeaders() });
  }

  createWithdrawal(transactionData: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.apiUrl}/transactions/withdrawal`, transactionData, { headers: this.getHeaders() });
  }

  notifyTransactionCreated(accountNumber:string): void {
    this.getTransactions(accountNumber).subscribe(transactions => {
      this.transactionCreatedSource.next(transactions);
    });
  }
}