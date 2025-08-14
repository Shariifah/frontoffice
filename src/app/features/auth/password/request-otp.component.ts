import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-password-request-otp',
  imports: [ReactiveFormsModule, InputText, Button, Card],
  template: `
    <div class="bg-[#F8FAF9] flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">


        <!-- Illustration -->
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 bg-gradient-to-br from-[#A3C9A8] to-[#2E5A44] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <!-- Titre -->
        <h1 class="text-2xl font-semibold text-center text-gray-900 mb-2">Mot de passe oublié</h1>
        <p class="text-center text-gray-500 mb-8">Entrez votre numéro pour recevoir un code de récupération</p>

        <!-- Formulaire -->
        <form class="space-y-5" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div>
            <label for="phonenumber" class="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
            <input
              type="tel"
              id="phonenumber"
              formControlName="phonenumber"
              placeholder=""
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors"
              [class.border-red-300]="form.get('phonenumber')?.invalid && form.get('phonenumber')?.touched"
            >
            <div [@if]="form.get('phonenumber')?.invalid && form.get('phonenumber')?.touched" class="text-red-500 text-sm mt-1">
              Le numéro de téléphone est requis
            </div>
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="w-full bg-[#2E5A44] text-white py-3 rounded-lg hover:bg-[#244734] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <span [@if]="!loading()">Recevoir le code</span>
            <span [@if]="loading()" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </span>
          </button>
        </form>

        <!-- Lien retour -->
        <p class="mt-6 text-center text-sm text-gray-600">
          <a routerLink="/auth/login" class="text-[#2E5A44] hover:underline font-medium">← Retour à la connexion</a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordRequestOtpComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    phonenumber: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    const payload = this.form.getRawValue();
    this.auth.requestPasswordResetOtp(payload).subscribe({
      next: () => {
        this.messages.add({ severity: 'success', summary: 'OTP envoyé', detail: 'Vérifiez vos SMS' });
        this.router.navigate(['/auth/password/verify-otp'], { queryParams: { phonenumber: payload.phonenumber } });
      },
      error: (err) => this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? "Échec d'envoi du code" }),
      complete: () => this.loading.set(false)
    });
  }
}


