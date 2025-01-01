import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../../services/auth/register.service';
import { RegisterRequest } from '../../services/auth/register.request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  
  constructor(private fb: FormBuilder, private registerService: RegisterService,  private router:Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  
      password: ['', [Validators.required, Validators.minLength(8)]],
      username: ['', [Validators.required, Validators.minLength(8)]]     
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerService.register(this.registerForm.value as RegisterRequest).subscribe({
        next: (response) => {
          console.log('user:', response);
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          console.error('error: ', error);
          alert('Error al registrar el usuario')
        }
      });
    }
  }
}
