import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@/pages/auth/services/auth';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-resend-otp',
  standalone: true,
  templateUrl: './resend-otp.html',
  styleUrls: ['./resend-otp.css'],
  providers: [MessageService],
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ]
})
export class ResendOtp implements OnInit {
  resendForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.resendForm = this.fb.group({
      phonenumber: ['', [Validators.required, Validators.pattern(/^\d{8,15}$/)]]
    });
  }

  onSubmit(): void {
    if (this.resendForm.invalid) return;

    this.loading = true;
    const formData = this.resendForm.value;

    this.authService.resendOtp(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'OTP envoyé',
          detail: 'Un nouveau code a été envoyé sur votre téléphone 📲',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: err.error?.message || 'Échec de l’envoi du code',
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
