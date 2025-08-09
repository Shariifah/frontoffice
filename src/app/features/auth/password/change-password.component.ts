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
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <p-card header="Changer le mot de passe">
        <form class="space-y-4 w-80" [formGroup]="form" (ngSubmit)="onSubmit()">
          <span class="p-float-label w-full">
            <input pPassword id="currentPassword" class="w-full" formControlName="currentPassword" [feedback]="false" />
            <label for="currentPassword">Mot de passe actuel</label>
          </span>
          <span class="p-float-label w-full">
            <input pPassword id="newPassword" class="w-full" formControlName="newPassword" [feedback]="false" />
            <label for="newPassword">Nouveau mot de passe</label>
          </span>
          <span class="p-float-label w-full">
            <input pPassword id="confirmPassword" class="w-full" formControlName="confirmPassword" [feedback]="false" />
            <label for="confirmPassword">Confirmer le mot de passe</label>
          </span>
          <button pButton type="submit" label="Mettre à jour" class="w-full" [disabled]="form.invalid || loading()"></button>
        </form>
      </p-card>
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


