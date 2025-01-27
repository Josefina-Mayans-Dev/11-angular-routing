import { Routes } from "@angular/router";
import { LayoutComponent } from "../../dashboard/layout/layout.component";
import { HomeComponent } from "../home/home.component";
import { TransactionFormComponent } from "../../views/transactions/transaction-form/transaction-form.component";
import { TransactionHistoryComponent } from "../../views/transactions/transaction-history/transaction-history.component";
import { LoginComponent } from "../auth/login/login.component";
import { AccountDetailComponent } from "../../views/accounts/account-detail/account-detail.component";
import { AccountListComponent } from "../../views/accounts/accounts-list/accounts-list.component";
import { RegisterComponent } from "../auth/register/register.component";
import { authGuard } from "./auth.guard";

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: "login", component:LoginComponent},
    { path: 'register', component: RegisterComponent },

    {
        path: 'dashboard',
        component: LayoutComponent, canActivate: [authGuard],
        children: [
          { path: 'transaction', component: TransactionFormComponent },
          { path: 'accounts', component: AccountListComponent },
          { path: 'account-detail', component: AccountDetailComponent },
          { path: 'transactions', component: TransactionHistoryComponent }
        ]
      },

      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }

      
  ];