import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../core/services/login-service.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private loginService: LoginService = inject(LoginService);

  protected username: string = '';
  protected password: string = '';
  protected isLoading = signal(false);
  protected loginError = signal(false);

  login() {
    this.isLoading.set(true);
    this.loginService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        console.log('Login successful:', response);

      },
      error: (error) => {
        this.isLoading.set(false);
        this.loginError.set(true);
      },
      complete: () => {
        alert('Login process completed');
        
      }
    });
  }
}
