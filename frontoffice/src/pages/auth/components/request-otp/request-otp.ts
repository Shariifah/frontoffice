import { Component } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-request-otp',
  templateUrl: './request-otp.html',
  imports: [
    ReactiveFormsModule,
    ButtonDirective
  ]
})
export class RequestOtpComponent {
  loading = false;

  form = this.fb.group({
    phonenumber: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.auth.requestOtp(this.form.value).subscribe({
      next: () => {
        localStorage.setItem('phonenumber', this.form.value.phonenumber!);
        this.router.navigate(['/auth/verify-otp']);
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => (this.loading = false),
    });
  }
}
