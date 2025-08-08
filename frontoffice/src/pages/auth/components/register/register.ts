import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@/pages/auth/services/auth';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule
  ],
})
export class Register implements OnInit {
  loading = false;
  otpToken = '';
  phonenumber = '';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.otpToken = localStorage.getItem('otpToken') || '';
    this.phonenumber = localStorage.getItem('phonenumber') || '';

    this.form = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      verifyPassword: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid || this.form.value.password !== this.form.value.verifyPassword) {
      return;
    }

    this.loading = true;

    const payload = {
      otpToken: this.otpToken,
      phonenumber: this.phonenumber,
      ...this.form.value,
    };

    this.auth.register(payload).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
