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
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, InputText, Password, Button, Card],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <p-card header="Mot de passe oublié - Étape 3">
        <form class="space-y-4 w-96" [formGroup]="form" (ngSubmit)="onSubmit()">
          <input type="hidden" formControlName="otpToken" />
          <span class="p-float-label w-full">
            <input pInputText id="phonenumber" class="w-full" formControlName="phonenumber" />
            <label for="phonenumber">Numéro de téléphone</label>
          </span>
          <span class="p-float-label w-full">
            <input pPassword id="newPassword" class="w-full" formControlName="newPassword" [feedback]="false" />
            <label for="newPassword">Nouveau mot de passe</label>
          </span>
          <span class="p-float-label w-full">
            <input pPassword id="confirmPassword" class="w-full" formControlName="confirmPassword" [feedback]="false" />
            <label for="confirmPassword">Confirmer le mot de passe</label>
          </span>
          <button pButton type="submit" label="Réinitialiser" class="w-full" [disabled]="form.invalid || loading()"></button>
        </form>
      </p-card>
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


