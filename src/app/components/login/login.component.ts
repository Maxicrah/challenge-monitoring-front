import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginRequest } from '../../services/auth/login.request';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgIf, RouterLinkActive, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm: FormGroup;

showPassword: boolean = false;
visible: boolean = true;
changeType: boolean = true;

constructor(private fb: FormBuilder, private router:Router, private loginService: LoginService) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
}

viewPassword() {
  this.visible =!this.visible;
  this.changeType =!this.changeType;
}

get email() {
  return this.loginForm.get('email');
}

get password() {
  return this.loginForm.get('password');
}


onSubmit() {
  if (this.loginForm.valid) {
    this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
      next: (userData) => {
        console.log(userData);
        this.router.navigateByUrl('/dashboard');
        this.loginForm.reset();
      },
      error: (errorData) => {
        console.error(errorData);
        alert("credenciales incorrectas");
      }
    })
  } else {
    this.loginForm.markAllAsTouched();
    alert("credenciales incorrectas");
  }
}
}