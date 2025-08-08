import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '@/pages/auth/services/auth';
import { Router } from '@angular/router';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [
    ReactiveFormsModule,
    ButtonDirective
  ]
})
export class Login implements OnInit {
  loading = false;
  form!: FormGroup;
  // FormGroup défini mais initialisé dans ngOnInit Pour Shariifah en revue

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      phonenumber: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
      password: ['', Validators.required],
    });
  }

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
