import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
// Formulario Reactivo
loginForm: FormGroup;

// Control del ojo
showPassword: boolean = false;
visible: boolean = true;
changeType: boolean = true;

constructor(private fb: FormBuilder) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
}


viewPassword() {
  this.visible =!this.visible;
  this.changeType =!this.changeType;
}
}