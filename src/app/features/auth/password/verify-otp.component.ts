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
    <div class="bg-[#F8FAF9] flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">


        <!-- Illustration -->
        <div class="flex justify-center mb-6">
          <div
            class="w-24 h-24 bg-gradient-to-br from-[#A3C9A8] to-[#2E5A44] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <!-- Titre -->
        <h1 class="text-2xl font-semibold text-center text-gray-900 mb-2">Vérification</h1>
        <p class="text-center text-gray-500 mb-8">Entrez le code reçu par SMS</p>

        <!-- Formulaire -->
        <form class="space-y-5" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div>
            <label for="phonenumber" class="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
            <input
              type="tel"
              id="phonenumber"
              formControlName="phonenumber"
              placeholder=""
              readonly
              class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Code de vérification</label>
            <div class="flex justify-center">
              <p-inputotp
                formControlName="otp"
                [length]="6"
              ></p-inputotp>
            </div>
            <div [@If]="form.get('otp')?.invalid && form.get('otp')?.touched"
                 class="text-red-500 text-sm mt-2 text-center">
              Le code doit contenir 6 chiffres
            </div>
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="w-full bg-[#2E5A44] text-white py-3 rounded-lg hover:bg-[#244734] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <span [@if]="!loading()">Vérifier le code</span>
            <span [@if]="loading()" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Vérification...
            </span>
          </button>

          <button
            type="button"
            (click)="resend()"
            [disabled]="loading()"
            class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Renvoyer le code
          </button>
        </form>

        <!-- Lien retour -->
        <p class="mt-6 text-center text-sm text-gray-600">
          <a routerLink="/auth/password/request-otp" class="text-[#2E5A44] hover:underline font-medium">← Retour</a>
        </p>
      </div>
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


