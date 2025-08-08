import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@/pages/auth/services/auth';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-request-otp',
  standalone: true,
  templateUrl: './request-otp.html',
  imports: [
    ReactiveFormsModule,
    ButtonDirective
  ]
})
export class RequestOtp implements OnInit {
  loading = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      phonenumber: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.auth.requestOtp(this.form.value).subscribe({
      next: () => {
        localStorage.setItem('phonenumber', this.form.value.phonenumber!);
        this.router.navigate(['/auth/verify-otp']);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => (this.loading = false),
    });
  }
}
