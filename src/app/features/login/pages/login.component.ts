import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formGroup!: FormGroup;
  username = '';
  password = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
  }

  // 初始化表單
  private initFormGroup(): void {
    this.formGroup = this.fb.nonNullable.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  onLogin() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.authService.login(this.formGroup.value).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/home/unit-test-example']); // 登入成功後導向其他頁面
      },
      error: (error) => {
        console.error('Login failed', error);
        alert('Invalid credentials'); // 顯示錯誤提示
      },
    });
  }

  // 表單的值若為空值，顯示紅框警告
  formControlInvalid(formControlName: string): boolean {
    const formControl = this.formGroup.get(formControlName);
    return formControl
      ? formControl.invalid && (formControl.dirty || formControl.touched)
      : false;
  }

  // 格式錯誤訊息提示
  showErrorMessage(name: string): string {
    const control = this.formGroup.get(name);
    if (control?.errors?.['required']) {
      return `此欄位必須輸入`;
    }
    return '';
  }
}
