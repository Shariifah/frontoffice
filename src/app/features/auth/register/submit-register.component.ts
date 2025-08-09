import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-submit-register',
  imports: [ReactiveFormsModule, InputText, Password, Button, Card],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <p-card header="Créer un compte - Étape 3">
        <form class="space-y-4 w-96" [formGroup]="form" (ngSubmit)="onSubmit()">
          <input type="hidden" formControlName="otpToken" />
          <span class="p-float-label w-full">
            <input pInputText id="firstname" class="w-full" formControlName="firstname" />
            <label for="firstname">Prénom</label>
          </span>
          <span class="p-float-label w-full">
            <input pInputText id="lastname" class="w-full" formControlName="lastname" />
            <label for="lastname">Nom</label>
          </span>
          <span class="p-float-label w-full">
            <input pInputText id="phonenumber" class="w-full" formControlName="phonenumber" />
            <label for="phonenumber">Numéro de téléphone</label>
          </span>
          <span class="p-float-label w-full">
            <input pPassword id="password" class="w-full" formControlName="password" [feedback]="false" />
            <label for="password">Mot de passe</label>
          </span>
          <span class="p-float-label w-full">
            <input pPassword id="verifyPassword" class="w-full" formControlName="verifyPassword" [feedback]="false" />
            <label for="verifyPassword">Confirmer le mot de passe</label>
          </span>
          <button pButton type="submit" label="Créer le compte" class="w-full" [disabled]="form.invalid || loading()"></button>
        </form>
      </p-card>
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
    otpToken: ['', [Validators.required]],
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
    if (ph) this.form.patchValue({ phonenumber: ph });
  }

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.auth.register(this.form.getRawValue()).subscribe({
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


