import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [Button, Card, NgIf],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <p-card header="Bourgeon">
        <div class="space-y-4">
          <div>
            <p class="text-gray-700">Bienvenue <b>{{ userName() }}</b></p>
          </div>
          <div class="flex gap-2">
            <button pButton type="button" label="Se déconnecter" class="p-button-danger" (click)="logout()"></button>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  readonly userName = computed(() => {
    const u = this.auth.user();
    return u ? `${u.firstname} ${u.lastname}` : 'Utilisateur';
  });

  logout() {
    this.auth.logout();
  }
}


