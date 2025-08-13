import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-submit-register',
  imports: [ReactiveFormsModule, RouterLink, InputText, Password, Button, Card],
  template: `
    <div class="bg-[#F8FAF9] min-h-screen p-4">
      <!-- Barre d'étapes -->
      <div class="max-w-md mx-auto mb-8">
        <div class="flex items-center justify-between">
          <!-- Étape 1 - Complétée -->
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-[#A3C9A8] rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2E5A44]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-sm font-medium text-[#2E5A44]">Numéro</span>
          </div>
          
          <!-- Ligne de connexion -->
          <div class="flex-1 h-0.5 bg-[#A3C9A8] mx-4"></div>
          
          <!-- Étape 2 - Complétée -->
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-[#A3C9A8] rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2E5A44]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-sm font-medium text-[#2E5A44]">Vérification</span>
          </div>
          
          <!-- Ligne de connexion -->
          <div class="flex-1 h-0.5 bg-[#A3C9A8] mx-4"></div>
          
          <!-- Étape 3 - Active -->
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-[#2E5A44] rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-[#2E5A44]">Compte</span>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="flex items-center justify-center">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <!-- Titre -->
          <h1 class="text-2xl font-semibold text-center text-gray-900 mb-2">Finaliser votre compte</h1>
          <p class="text-center text-gray-500 mb-8">Complétez vos informations personnelles</p>

          <!-- Formulaire -->
          <form class="space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
            <input type="hidden" formControlName="otpToken" />
            
            <div>
              <label for="firstname" class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input 
                type="text" 
                id="firstname" 
                formControlName="firstname"
                placeholder="Votre prénom" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors"
                [class.border-red-300]="form.get('firstname')?.invalid && form.get('firstname')?.touched"
              >
              @if (form.get('firstname')?.invalid && form.get('firstname')?.touched) {
                <div class="text-red-500 text-sm mt-1">
                  Le prénom est requis
                </div>
              }
            </div>

            <div>
              <label for="lastname" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input 
                type="text" 
                id="lastname" 
                formControlName="lastname"
                placeholder="Votre nom" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors"
                [class.border-red-300]="form.get('lastname')?.invalid && form.get('lastname')?.touched"
              >
              @if (form.get('lastname')?.invalid && form.get('lastname')?.touched) {
                <div class="text-red-500 text-sm mt-1">
                  Le nom est requis
                </div>
              }
            </div>

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
                  placeholder="70 00 00 00" 
                  readonly
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg bg-gray-50 text-gray-600"
                >
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <p-password 
                inputId="password" 
                formControlName="password" 
                [feedback]="false" 
                [toggleMask]="true"
                placeholder="Votre mot de passe"
                [inputStyleClass]="'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors'"
                [class.border-red-300]="form.get('password')?.invalid && form.get('password')?.touched"
              ></p-password>
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <div class="text-red-500 text-sm mt-1">
                  Le mot de passe doit contenir au moins 6 caractères
                </div>
              }
            </div>

            <div>
              <label for="verifyPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <p-password 
                inputId="verifyPassword" 
                formControlName="verifyPassword" 
                [feedback]="false" 
                [toggleMask]="true"
                placeholder="Confirmez votre mot de passe"
                [inputStyleClass]="'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors'"
                [class.border-red-300]="form.get('verifyPassword')?.invalid && form.get('verifyPassword')?.touched"
              ></p-password>
              @if (form.get('verifyPassword')?.invalid && form.get('verifyPassword')?.touched) {
                <div class="text-red-500 text-sm mt-1">
                  La confirmation du mot de passe est requise
                </div>
              }
            </div>

            <p-button 
              type="submit"
              [disabled]="form.invalid || loading()"
              label="Créer mon compte"
              styleClass="w-full mt-6"
              [loading]="loading()"
            ></p-button>
          </form>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmitRegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messages = inject(MessageService);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    otpToken: [''],
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    phonenumber: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    verifyPassword: ['', [Validators.required]]
  });

  constructor() {
    const qp = this.route.snapshot.queryParamMap;
    const otpToken = qp.get('otpToken');
    const ph = qp.get('phonenumber');
    if (otpToken) this.form.patchValue({ otpToken });
    if (ph) {
      // Extraire le numéro sans l'indicatif pour l'affichage
      const numberWithoutPrefix = ph.replace('+226', '');
      this.form.patchValue({ phonenumber: numberWithoutPrefix });
    }
  }

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    
    // Reconstruire le numéro complet avec l'indicatif
    const fullPhoneNumber = '+226' + this.form.get('phonenumber')?.value;
    const formData = this.form.getRawValue();
    formData.phonenumber = fullPhoneNumber;
    
    this.auth.register(formData).subscribe({
      next: (res) => {
        this.auth.storeAuth(res.user, { accessToken: res.accessToken, refreshToken: res.refreshToken });
        this.messages.add({ severity: 'success', summary: 'Inscription réussie', detail: 'Bienvenue sur Bourgeon' });
        this.router.navigateByUrl('/');
      },
      error: (err) => this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? "Échec de l'inscription" }),
      complete: () => this.loading.set(false)
    });
  }
}


