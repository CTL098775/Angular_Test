import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitTestExampleService } from '../services/unit-test-example.service';

@Component({
  selector: 'app-unit-test-example',
  templateUrl: './unit-test-example.component.html',
  styleUrls: ['./unit-test-example.component.scss'],
})
export class UnitTestExampleComponent {
  formGroup!: FormGroup;
  message: string = '';
  genderOptions = [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' },
  ];

  foodKindOptions = [
    { value: 'meat', label: '葷' },
    { value: 'vegetable', label: '素' },
  ];

  constructor(
    private fb: FormBuilder,
    private unitTestExampleService: UnitTestExampleService,
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
  }

  // 初始化表單
  private initFormGroup(): void {
    this.formGroup = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneNumberValidator()]],
      gender: [this.genderOptions[0].value, Validators.required],
      kind: [this.foodKindOptions[0].value, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.unitTestExampleService.submitForm(this.formGroup.value).subscribe({
      next: (response) => {
        alert('表單提交成功');
      },
      error: (error) => {
        alert('表單提交失敗');
        console.error('Error Submit:', error.message);
      },
    });
  }

  // 驗證電話號碼為10碼
  private phoneNumberValidator() {
    return (control: any): { [key: string]: boolean } | null => {
      const cleaned = control.value.replace(/\D/g, '');
      if (!cleaned) {
        return { required: true };
      }
      return cleaned.length === 10 ? null : { incompletePhoneNumber: true };
    };
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
    if (control?.errors?.['incompletePhoneNumber']) {
      return `請輸入完整電話號碼`;
    }
    if (control?.errors?.['email']) {
      return `請輸入有效電子信箱`;
    }
    return '';
  }
}
