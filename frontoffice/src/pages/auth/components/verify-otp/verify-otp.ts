import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
})
export class VerifyOtpComponent {
  loading = false;
  phonenumber = localStorage.getItem('phonenumber') || '';

  form = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    const data = {
      phonenumber: this.phonenumber,
      otp: this.form.value.otp,
    };

    this.auth.verifyOtp(data).subscribe({
      next: (res: { otpToken: string; }) => {
        localStorage.setItem('otpToken', res.otpToken);
        this.router.navigate(['/auth/register']);
      },
      error: (err: any) => console.error(err),
      complete: () => (this.loading = false),
    });
  }
}
