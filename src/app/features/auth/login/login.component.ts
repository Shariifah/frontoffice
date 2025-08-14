import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, InputText, Password, Button, Card],
  template: `
    <div class="bg-[#F8FAF9] flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        <!-- Illustration -->
        <div class="flex justify-center mb-6">
          <div class="w-24 h-24 bg-gradient-to-br from-[#A3C9A8] to-[#2E5A44] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>

        <!-- Titre -->
        <h1 class="text-2xl font-semibold text-center text-gray-900 mb-2">Connexion</h1>
        <p class="text-center text-gray-500 mb-8">Accédez à votre compte</p>

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

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <p-password
              inputId="password"
              formControlName="password"
              [feedback]="false"
              [toggleMask]="true"
              class="w-full"
              placeholder="Votre mot de passe"
              [inputStyleClass]="'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E5A44] focus:border-[#2E5A44] transition-colors'"
              [class.border-red-300]="form.get('password')?.invalid && form.get('password')?.touched"
            ></p-password>
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <div class="text-red-500 text-sm mt-1">
                Le mot de passe est requis
              </div>
            }
          </div>
          <p-button
            type="submit"
            [disabled]="form.invalid || loading()"
            label="Se connecter"
            styleClass="w-full"
            [loading]="loading()"
          ></p-button>
        </form>

        <!-- Liens -->
        <div class="mt-6 space-y-3">
          <p-button
            routerLink="/auth/register/request-otp"
            label="Créer un compte"
            styleClass="w-full p-button-secondary"
          ></p-button>

          <p-button
            routerLink="/auth/password/request-otp"
            label="Mot de passe oublié ?"
            styleClass="w-full p-button-text"
          ></p-button>
        </div>
      </div>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    phonenumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);

    // Ajouter l'indicatif 226 au numéro
    const phoneNumber = '226' + this.form.get('phonenumber')?.value;
    const passwordValue = this.form.get('password')?.value;

    if (!passwordValue) {
      this.loading.set(false);
      return;
    }

    const payload = { phonenumber: phoneNumber, password: passwordValue };

    this.auth.login(payload).subscribe({
      next: (res) => {
        this.auth.storeAuth(null, { accessToken: res.accessToken, refreshToken: res.refreshToken });
        this.messages.add({ severity: 'success', summary: 'Succès', detail: 'Authentification réussie' });
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? 'Échec connexion' });
      },
      complete: () => this.loading.set(false)
    });
  }
}


