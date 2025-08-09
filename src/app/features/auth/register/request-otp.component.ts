import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-request-otp',
  imports: [ReactiveFormsModule, InputText, Button, Card],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <p-card header="Créer un compte - Étape 1">
        <form class="space-y-4 w-80" [formGroup]="form" (ngSubmit)="onSubmit()">
          <span class="p-float-label w-full">
            <input pInputText id="phonenumber" class="w-full" formControlName="phonenumber" />
            <label for="phonenumber">Numéro de téléphone</label>
          </span>
          <button pButton type="submit" label="Recevoir le code" class="w-full" [disabled]="form.invalid || loading()"></button>
        </form>
      </p-card>
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
    phonenumber: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    const payload = this.form.getRawValue();
    this.auth.requestOtp(payload).subscribe({
      next: () => {
        this.messages.add({ severity: 'success', summary: 'OTP envoyé', detail: 'Vérifiez vos SMS' });
        this.router.navigate(['/auth/register/verify-otp'], { queryParams: { phonenumber: payload.phonenumber } });
      },
      error: (err) => {
        this.messages.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message ?? "Échec d'envoi du code" });
      },
      complete: () => this.loading.set(false)
    });
  }
}


