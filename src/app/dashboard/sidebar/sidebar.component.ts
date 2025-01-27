import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnDestroy{
  username: string | null = null;
  usernameSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.usernameSubscription = this.authService.username$.subscribe(username => {
      this.username = username
    })
  }

  accounts() {
    this.router.navigate(['/dashboard/accounts']);
  }

  transactions() {
    this.router.navigate(['/dashboard/transactions']);
  }

  ngOnDestroy(): void {
    if(this.usernameSubscription) {
        this.usernameSubscription.unsubscribe()
    }
  }
}