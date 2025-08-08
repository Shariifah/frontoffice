import { Component } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [
    ReactiveFormsModule,
    ButtonDirective
  ]
})
export class RegisterComponent {
  loading = false;
  otpToken = localStorage.getItem('otpToken') || '';
  phonenumber = localStorage.getItem('phonenumber') || '';

  form = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    verifyPassword: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

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
      error: (err) => console.error(err),
      complete: () => (this.loading = false),
    });
  }
}
