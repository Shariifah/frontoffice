import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { InputOtp } from 'primeng/inputotp';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-password-verify-otp',
  imports: [ReactiveFormsModule, InputOtp, Button, Card, InputText],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <p-card header="Mot de passe oublié - Étape 2">
        <form class="space-y-4 w-80" [formGroup]="form" (ngSubmit)="onSubmit()">
          <span class="p-float-label w-full">
            <input pInputText id="phonenumber" class="w-full" formControlName="phonenumber" />
            <label for="phonenumber">Numéro de téléphone</label>
          </span>
          <p-inputotp formControlName="otp" [length]="6"></p-inputotp>
          <p-button type="submit" label="Vérifier" styleClass="w-full" [disabled]="form.invalid || loading()"></p-button>
          <p-button type="button" label="Renvoyer" styleClass="w-full p-button-secondary" (onClick)="resend()" [disabled]="loading()"></p-button>
        </form>
      </p-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordVerifyOtpComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messages = inject(MessageService);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    phonenumber: ['', [Validators.required]],
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  constructor() {
    const phone = this.route.snapshot.queryParamMap.get('phonenumber');
    if (phone) this.form.patchValue({ phonenumber: phone });
  }

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.auth.verifyPasswordResetOtp(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.messages.add({ severity: 'success', summary: 'Code vérifié', detail: 'Définissez votre nouveau mot de passe' });
        this.router.navigate(['/auth/password/reset'], { queryParams: { phonenumber: res.phonenumber, otpToken: res.otpToken } });
      },
      error: (err) => this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? 'Code invalide' }),
      complete: () => this.loading.set(false)
    });
  }

  resend() {
    if (this.loading()) return;
    const phonenumber = this.form.controls.phonenumber.value;
    if (!phonenumber) return;
    this.loading.set(true);
    this.auth.requestPasswordResetOtp({ phonenumber }).subscribe({
      next: () => this.messages.add({ severity: 'info', summary: 'OTP renvoyé', detail: 'Nouveau code envoyé' }),
      error: (err) => this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? 'Échec renvoi OTP' }),
      complete: () => this.loading.set(false)
    });
  }
}


