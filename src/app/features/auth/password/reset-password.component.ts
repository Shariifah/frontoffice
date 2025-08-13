import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, Password, RouterLink],
  template: `
    <div class="bg-[#F8FAF9] flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <div class="bg-[#A3C9A8] rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#2E5A44]" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l4-4m0 0l4 4m-4-4v12"/>
            </svg>
          </div>
        </div>

        <!-- Illustration -->
        <div class="flex justify-center mb-6">
          <div
            class="w-24 h-24 bg-gradient-to-br from-[#A3C9A8] to-[#2E5A44] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>
        </div>

        <!-- Titre -->
        <h1 class="text-2xl font-semibold text-center text-gray-900 mb-2">Nouveau mot de passe</h1>
        <p class="text-center text-gray-500 mb-8">Définissez votre nouveau mot de passe</p>

        <!-- Formulaire -->
        <form class="space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
          <input type="hidden" formControlName="otpToken"/>

          <div>
            <label for="phonenumber" class="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
            <input
              type="tel"
              id="phonenumber"
              formControlName="phonenumber"
              placeholder="+226 70 00 00 00"
              readonly
              class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            >
          </div>

          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <p-password
              inputId="newPassword"
              formControlName="newPassword"
              [feedback]="false"
              [toggleMask]="true"
              placeholder="Votre nouveau mot de passe"
              [inputStyleClass]="'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors'"
              [class.border-red-300]="form.get('newPassword')?.invalid && form.get('newPassword')?.touched"
            ></p-password>
            <div *ngIf="form.get('newPassword')?.invalid && form.get('newPassword')?.touched"
                 class="text-red-500 text-sm mt-1">
              Le mot de passe doit contenir au moins 6 caractères
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de
              passe</label>
            <p-password
              inputId="confirmPassword"
              formControlName="confirmPassword"
              [feedback]="false"
              [toggleMask]="true"
              placeholder="Confirmez votre nouveau mot de passe"
              [inputStyleClass]="'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors'"
              [class.border-red-300]="form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched"
            ></p-password>
            <div [@If]="form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched"
                 class="text-red-500 text-sm mt-1">
              La confirmation du mot de passe est requise
            </div>
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="w-full bg-[#2E5A44] text-white py-3 rounded-lg hover:bg-[#244734] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-6"
          >
            <span [@if]="!loading()">Réinitialiser le mot de passe</span>
            <span [@if]="loading()" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Réinitialisation...
            </span>
          </button>
        </form>

        <!-- Lien retour -->
        <p class="mt-6 text-center text-sm text-gray-600">
          <a routerLink="/auth/password/verify-otp" class="text-[#2E5A44] hover:underline font-medium">← Retour</a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messages = inject(MessageService);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    otpToken: ['', [Validators.required]],
    phonenumber: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor() {
    const qp = this.route.snapshot.queryParamMap;
    const otpToken = qp.get('otpToken');
    const ph = qp.get('phonenumber');
    if (otpToken) this.form.patchValue({ otpToken });
    if (ph) this.form.patchValue({ phonenumber: ph });
  }

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.auth.resetPassword(this.form.getRawValue()).subscribe({
      next: () => {
        this.messages.add({ severity: 'success', summary: 'Succès', detail: 'Mot de passe réinitialisé' });
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? 'Échec de réinitialisation' }),
      complete: () => this.loading.set(false)
    });
  }
}


