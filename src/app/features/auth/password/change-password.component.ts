import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, Password, Button, Card],
  template: `
    <div class="bg-[#F8FAF9] flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <div class="bg-[#A3C9A8] rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#2E5A44]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </div>
        </div>

        <!-- Illustration -->
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 bg-gradient-to-br from-[#A3C9A8] to-[#2E5A44] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        <!-- Titre -->
        <h1 class="text-2xl font-semibold text-center text-gray-900 mb-2">Changer le mot de passe</h1>
        <p class="text-center text-gray-500 mb-8">Mettez à jour votre mot de passe</p>

        <!-- Formulaire -->
        <form class="space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <p-password 
              inputId="currentPassword" 
              formControlName="currentPassword" 
              [feedback]="false" 
              [toggleMask]="true"
              placeholder="Votre mot de passe actuel"
              [inputStyleClass]="'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors'"
              [class.border-red-300]="form.get('currentPassword')?.invalid && form.get('currentPassword')?.touched"
            ></p-password>
            <div *ngIf="form.get('currentPassword')?.invalid && form.get('currentPassword')?.touched" class="text-red-500 text-sm mt-1">
              Le mot de passe actuel est requis
            </div>
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
            <div *ngIf="form.get('newPassword')?.invalid && form.get('newPassword')?.touched" class="text-red-500 text-sm mt-1">
              Le nouveau mot de passe doit contenir au moins 6 caractères
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <p-password 
              inputId="confirmPassword" 
              formControlName="confirmPassword" 
              [feedback]="false" 
              [toggleMask]="true"
              placeholder="Confirmez votre nouveau mot de passe"
              [inputStyleClass]="'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors'"
              [class.border-red-300]="form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched"
            ></p-password>
            <div *ngIf="form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched" class="text-red-500 text-sm mt-1">
              La confirmation du mot de passe est requise
            </div>
          </div>

          <button 
            type="submit"
            [disabled]="form.invalid || loading()"
            class="w-full bg-[#2E5A44] text-white py-3 rounded-lg hover:bg-[#244734] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-6"
          >
            <span *ngIf="!loading()">Mettre à jour</span>
            <span *ngIf="loading()" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mise à jour...
            </span>
          </button>
        </form>

        <!-- Lien retour -->
        <p class="mt-6 text-center text-sm text-gray-600">
          <a routerLink="/" class="text-[#2E5A44] hover:underline font-medium">← Retour au tableau de bord</a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.auth.changePassword(this.form.getRawValue()).subscribe({
      next: () => {
        this.messages.add({ severity: 'success', summary: 'Succès', detail: 'Mot de passe modifié' });
        this.router.navigateByUrl('/');
      },
      error: (err) => this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? 'Échec de modification' }),
      complete: () => this.loading.set(false)
    });
  }
}


