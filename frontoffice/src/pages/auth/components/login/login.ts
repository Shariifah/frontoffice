import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
})
export class LoginComponent {
  loading = false;

  form = this.fb.group({
    phonenumber: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error(err),
      complete: () => (this.loading = false),
    });
  }
}
