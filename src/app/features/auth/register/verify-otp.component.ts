import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { InputOtp } from 'primeng/inputotp';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-verify-otp',
  imports: [ReactiveFormsModule, RouterLink, InputOtp, Button, Card, InputText],
  template: `
    <div class="bg-[#F8FAF9] min-h-screen p-4">
      <!-- Barre d'étapes -->
      <div class="max-w-md mx-auto mb-8">
        <div class="flex items-center justify-between">
          <!-- Étape 1 - Complétée -->
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-[#A3C9A8] rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2E5A44]" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-sm font-medium text-[#2E5A44]">Numéro</span>
          </div>

          <!-- Ligne de connexion -->
          <div class="flex-1 h-0.5 bg-[#A3C9A8] mx-4"></div>

          <!-- Étape 2 - Active -->
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-[#2E5A44] rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-sm font-medium text-[#2E5A44]">Vérification</span>
          </div>

          <!-- Ligne de connexion -->
          <div class="flex-1 h-0.5 bg-gray-300 mx-4"></div>

          <!-- Étape 3 - Inactive -->
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
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
              <div class="flex">
                <div
                  class="flex-shrink-0 px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 font-medium">
                  +
                </div>
                <input
                  type="tel"
                  id="phonenumber"
                  formControlName="phonenumber"
                  placeholder="70 00 00 00"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg bg-gray-50 text-gray-600"
                  [readonly]="true"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Code de vérification</label>
              <div class="flex justify-center">
                <p-inputotp
                  formControlName="otp"
                  [length]="6"
                ></p-inputotp>
              </div>
              @if (form.get('otp')?.invalid && form.get('otp')?.touched) {
                <div class="text-red-500 text-sm mt-2 text-center">
                  Le code doit contenir 6 chiffres
                </div>
              }
            </div>

            <p-button
              type="submit"
              [disabled]="form.invalid || loading()"
              label="Vérifier le code"
              styleClass="w-full"
              [loading]="loading()"
            ></p-button>

            <p-button
              type="button"
              (onClick)="resend()"
              [disabled]="loading()"
              label="Renvoyer le code"
              styleClass="w-full p-button-secondary"
            ></p-button>

            <!-- Bouton pour modifier le numéro -->
            <p-button
              type="button"
              (onClick)="changeNumber()"
              [disabled]="loading()"
              label="Modifier le numéro"
              styleClass="w-full p-button-text"
            ></p-button>
          </form>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyOtpComponent {
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
    if (phone) {
      // Extraire le numéro sans l'indicatif pour l'affichage
      const numberWithoutPrefix = phone.replace('', '');
      this.form.patchValue({ phonenumber: numberWithoutPrefix });
    }
  }

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);

    // Reconstruire le numéro complet avec l'indicatif
    const fullPhoneNumber = '' + this.form.get('phonenumber')?.value;
    const otpValue = this.form.get('otp')?.value;

    if (!otpValue) {
      this.loading.set(false);
      return;
    }

    const payload = { phonenumber: fullPhoneNumber, otp: otpValue };

    this.auth.verifyOtp(payload).subscribe({
      next: (res: any) => {
        // Stocker l'otpToken dans le localStorage
        // L'API retourne { success: true, data: { otpToken: "...", phonenumber: "..." } }
        const otpToken = res.data?.otpToken;
        const phonenumber = res.data?.phonenumber;
        
        if (otpToken) {
          localStorage.setItem('otpToken', otpToken);
        }
        
        if (phonenumber) {
          localStorage.setItem('phonenumber', phonenumber);
        }

        this.messages.add({ severity: 'success', summary: 'Code vérifié', detail: 'Veuillez finaliser votre inscription' });
        this.router.navigate(['/auth/register/submit']);
      },
      error: (err) => {
        this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? 'Code invalide' });
      },
      complete: () => this.loading.set(false)
    });
  }

  resend() {
    if (this.loading()) return;
    const phonenumber = '' + this.form.controls.phonenumber.value;
    if (!phonenumber) return;
    this.loading.set(true);
    this.auth.resendOtp({ phonenumber }).subscribe({
      next: () => this.messages.add({ severity: 'info', summary: 'OTP renvoyé', detail: 'Nouveau code envoyé' }),
      error: (err) => this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? 'Échec renvoi OTP' }),
      complete: () => this.loading.set(false)
    });
  }

  changeNumber() {
    // Nettoyer le localStorage avant de retourner à l'étape précédente
    localStorage.removeItem('otpToken');
    localStorage.removeItem('phonenumber');
    this.router.navigate(['/auth/register/request-otp']);
  }

  // Méthode pour nettoyer le localStorage si l'utilisateur quitte
  ngOnDestroy() {
    // Optionnel : nettoyer le localStorage si l'utilisateur quitte sans compléter
    // localStorage.removeItem('otpToken');
    // localStorage.removeItem('phonenumber');
  }
}


