import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@/pages/auth/services/auth';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.css'],
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ]
})
export class VerifyOtpComponent implements OnInit {
  loading = false;
  phonenumber = '';
  form!: FormGroup;
  //  Déclaration sans initialisation

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const phone = localStorage.getItem('phonenumber');
    if (!phone) {
      this.router.navigate(['/auth/request-otp']);
      return;
    }

    this.phonenumber = phone;

    //  Initialisation ici, une fois que fb est prêt
    this.form = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const data = {
      phonenumber: this.phonenumber,
      otp: this.form.value.otp,
    };

    this.auth.verifyOtp(data).subscribe({
      next: (res: { otpToken: string }) => {
        localStorage.setItem('otpToken', res.otpToken);
        this.router.navigate(['/auth/register']);
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
