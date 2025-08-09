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
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <p-card header="Connexion">
        <form class="space-y-4 w-80" [formGroup]="form" (ngSubmit)="onSubmit()">
          <span class="p-float-label w-full">
            <input pInputText id="phonenumber" class="w-full" formControlName="phonenumber" />
            <label for="phonenumber">Numéro de téléphone</label>
          </span>

          <span class="p-float-label w-full">
            <p-password inputId="password" formControlName="password" [feedback]="false" styleClass="w-full"></p-password>
            <label for="password">Mot de passe</label>
          </span>

          <p-button type="submit" label="Se connecter" styleClass="w-full" [disabled]="form.invalid || loading()"></p-button>

          <div class="text-sm grid grid-cols-2 gap-2">
            <p-button routerLink="/auth/register/request-otp" label="Créer un compte" styleClass="w-full p-button-secondary"></p-button>
            <p-button routerLink="/auth/password/request-otp" label="Mot de passe oublié ?" styleClass="w-full p-button-text"></p-button>
          </div>
        </form>
      </p-card>
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
    phonenumber: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
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


