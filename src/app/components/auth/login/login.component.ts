import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { IAuth } from '../../../interfaces/auth.interface';
import { filter, map, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService) {
      this.loginForm = new FormGroup({
          username: new FormControl('', [Validators.required]),
          password: new FormControl('', [Validators.required]),
      });
  }

  ngOnInit(): void {
  }

  login() {
      if (this.loginForm.valid) {
          this.authService.login(this.loginForm.value).subscribe({
              next: (data) => {
                  this.authService.setToken(data.token);
                  const username = this.authService.decodeTokenAndGetUsername(data.token);
                  if(username) {
                    this.authService.setUsername(username);
                    this.router.navigate(['/dashboard/accounts']);
                  } else {
                    this.errorMessage = 'No se pudo obtener el nombre de usuario del token.';
                  }
              },
              error: (error) => {
                  this.errorMessage = 'Credenciales incorrectas';
              }
          });
      } else {
          this.errorMessage = 'Por favor, completa el formulario correctamente';
      }
  }

  register() {
      this.router.navigate(['/register']);
  }

  get usernameControl() {
      return this.loginForm.get('username');
  }
    
    get passwordControl() {
      return this.loginForm.get('password');
    }

}
