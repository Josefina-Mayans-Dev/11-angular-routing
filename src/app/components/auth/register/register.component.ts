import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService) {
      this.registerForm = new FormGroup({
          username: new FormControl('', [Validators.required]),
          password: new FormControl('', [Validators.required]),
          roles: new FormControl('', [Validators.required]),
      });
  }

  ngOnInit(): void {
  }

  register() {
      if (this.registerForm.valid) {
          this.authService.register(this.registerForm.value).subscribe({
              next: (data) => {
                  this.router.navigate(['/login']); 
              },
              error: (error) => {
                  this.errorMessage = 'Error en el registro. Por favor, inténtelo de nuevo.';
              }
          });
      } else {
          this.errorMessage = 'Por favor, completa el formulario correctamente';
      }
  }


  login() {
      this.router.navigate(['/login']);
  }

  get nameControl() {
      return this.registerForm.get('username');
  }

  get passwordControl() {
      return this.registerForm.get('password');
  }

  get roleControl() {
      return this.registerForm.get('roles');
  }

}
