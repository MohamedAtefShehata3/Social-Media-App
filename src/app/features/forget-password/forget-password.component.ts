import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';

const PASSWORD_PATTERN = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
})
export class ForgetPasswordComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  step: 1 | 2 | 3 | 4 = 1;
  loading = false;
  msgError = '';
  isPasswordVisible = false;
  resendSeconds = 0;

  private cooldownTimer?: ReturnType<typeof setInterval>;
  private redirectTimer?: ReturnType<typeof setTimeout>;

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  codeForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
  });

  passwordForm = new FormGroup(
    {
      newPassword: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatch },
  );

  get email(): string {
    return this.emailForm.value.email ?? '';
  }

  get rules() {
    const v = this.passwordForm.value.newPassword ?? '';
    return [
      { label: 'At least 8 characters', ok: v.length >= 8 },
      { label: 'Uppercase letter', ok: /[A-Z]/.test(v) },
      { label: 'Lowercase letter', ok: /[a-z]/.test(v) },
      { label: 'A number', ok: /[0-9]/.test(v) },
      { label: 'A symbol (#?!@$%^&*-)', ok: /[#?!@$%^&*-]/.test(v) },
    ];
  }

  ngOnDestroy(): void {
    clearInterval(this.cooldownTimer);
    clearTimeout(this.redirectTimer);
  }

  sendCode(): void {
    if (this.emailForm.invalid) return this.emailForm.markAllAsTouched();
    this.request(this.authService.forgotPassword(this.email), () => {
      this.step = 2;
      this.startCooldown();
    });
  }

  resendCode(): void {
    if (this.resendSeconds > 0 || this.loading) return;
    this.request(this.authService.forgotPassword(this.email), () => this.startCooldown());
  }

  verifyCode(): void {
    if (this.codeForm.invalid) return this.codeForm.markAllAsTouched();
    this.request(
      this.authService.verifyResetCode({ email: this.email, code: this.codeForm.value.code! }),
      () => (this.step = 3),
    );
  }

  resetPassword(): void {
    if (this.passwordForm.invalid) return this.passwordForm.markAllAsTouched();
    this.request(
      this.authService.resetPassword({
        email: this.email,
        code: this.codeForm.value.code!,
        newPassword: this.passwordForm.value.newPassword!,
      }),
      () => {
        this.step = 4;
        this.redirectTimer = setTimeout(() => this.router.navigate(['/login']), 3000);
      },
    );
  }

  goBack(step: 1 | 2): void {
    this.msgError = '';
    this.step = step;
  }

  private request(req$: Observable<any>, onSuccess: () => void): void {
    this.loading = true;
    this.msgError = '';
    req$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading = false;
        onSuccess();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.msgError = err.error?.message || 'Something went wrong, please try again.';
      },
    });
  }

  private startCooldown(): void {
    clearInterval(this.cooldownTimer);
    this.resendSeconds = 60;
    this.cooldownTimer = setInterval(() => {
      this.resendSeconds--;
      if (this.resendSeconds <= 0) clearInterval(this.cooldownTimer);
    }, 1000);
  }
}
