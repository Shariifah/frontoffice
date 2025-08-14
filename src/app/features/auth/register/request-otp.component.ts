import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-request-otp',
  imports: [ReactiveFormsModule, RouterLink, InputText, Button, Card],
  template: `
    <div class="bg-[#F8FAF9] min-h-screen p-4">
      <!-- Barre d'étapes -->
      <div class="max-w-md mx-auto mb-8">
        <div class="flex items-center justify-between">
          <!-- Étape 1 - Active -->
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-[#2E5A44] rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-[#2E5A44]">Numéro</span>
          </div>

          <!-- Ligne de connexion -->
          <div class="flex-1 h-0.5 bg-gray-300 mx-4"></div>

          <!-- Étape 2 - Inactive -->
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm text-gray-500">Vérification</span>
          </div>

          <!-- Ligne de connexion -->
          <div class="flex-1 h-0.5 bg-gray-300 mx-4"></div>

          <!-- Étape 3 - Inactive -->
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span class="text-sm text-gray-500">Compte</span>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="flex items-center justify-center">
        <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

          <!-- Illustration -->
          <div class="flex justify-center mb-6">
            <div class="w-24 h-24 bg-gradient-to-br from-[#A3C9A8] to-[#2E5A44] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>

          <!-- Titre -->
          <h1 class="text-2xl font-semibold text-center text-gray-900 mb-2">Créer votre compte</h1>
          <p class="text-center text-gray-500 mb-8">Entrez votre numéro pour commencer</p>

          <!-- Formulaire -->
          <form class="space-y-5" [formGroup]="form" (ngSubmit)="onSubmit()">
            <div>
              <label for="phonenumber" class="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
              <div class="flex">
                <div class="flex-shrink-0 px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 font-medium">
                  +226
                </div>
                <input
                  type="tel"
                  id="phonenumber"
                  formControlName="phonenumber"
                  placeholder=""
                  required
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors"
                  [class.border-red-300]="form.get('phonenumber')?.invalid && form.get('phonenumber')?.touched"
                >
              </div>
              @if (form.get('phonenumber')?.invalid && form.get('phonenumber')?.touched) {
                <div class="text-red-500 text-sm mt-1">
                  Le numéro de téléphone est requis
                </div>
              }
            </div>

            <p-button
              type="submit"
              [disabled]="form.invalid || loading()"
              label="Recevoir le code"
              styleClass="w-full"
              [loading]="loading()"
            ></p-button>
          </form>

          <!-- Lien connexion -->
          <p class="mt-6 text-center text-sm text-gray-600">
            Vous avez déjà un compte ?
            <a routerLink="/auth/login" class="text-[#2E5A44] hover:underline font-medium">Connectez-vous</a>
          </p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestOtpComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    phonenumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]]
  });

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);

    // Ajouter l'indicatif 226 au numéro
    const phoneNumber = '226' + this.form.get('phonenumber')?.value;
    const payload = { phonenumber: phoneNumber };

    this.auth.requestOtp(payload).subscribe({
      next: () => {
        this.messages.add({ severity: 'success', summary: 'OTP envoyé', detail: 'Vérifiez vos SMS' });
        this.router.navigate(['/auth/register/verify-otp'], { queryParams: { phonenumber: phoneNumber } });
      },
      error: (err) => {
        this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? "Échec d'envoi du code" });
      },
      complete: () => this.loading.set(false)
    });
  }
}


