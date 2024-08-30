import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UnitTestExampleComponent } from './unit-test-example.component';
import { UnitTestExampleService } from '../services/unit-test-example.service';
import { of } from 'rxjs';

describe('UnitTestExampleComponent', () => {
  let component: UnitTestExampleComponent;
  let fixture: ComponentFixture<UnitTestExampleComponent>;
  let service: UnitTestExampleService;
  let spyService: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitTestExampleComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [UnitTestExampleService],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitTestExampleComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(UnitTestExampleService);
    spyService = spyOn(service, 'submitForm').and.callThrough();
    fixture.detectChanges();
  });

  // 測試元件是否建立成功
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // 測試表單初始化
  it('初始化表單並設預設值', () => {
    const formGroup = component.formGroup;

    expect(formGroup).toBeTruthy();
    expect(formGroup.get('name')?.value).toBe('');
    expect(formGroup.get('email')?.value).toBe('');
    expect(formGroup.get('phone')?.value).toBe('');
    expect(formGroup.get('gender')?.value).toBe('male');
    expect(formGroup.get('kind')?.value).toBe('meat');
  });

  // 測試電話號碼驗證
  it('驗證電話號碼是否為10碼', () => {
    const control = component.formGroup.get('phone');

    control?.setValue('1234567890');
    expect(control?.valid).toBeTrue();

    control?.setValue('123456789'); // 少於10碼
    expect(control?.valid).toBeFalse();
    expect(control?.errors?.['incompletePhoneNumber']).toBeTrue();

    control?.setValue(''); // 測試空值
    expect(control?.valid).toBeFalse();
    expect(control?.errors?.['required']).toBeTrue();
  });

  // 測試信箱驗證器
  it('驗證信箱格式', () => {
    const control = component.formGroup.get('email');

    control?.setValue('test@example.com');
    expect(control?.valid).toBeTrue();

    control?.setValue('invalid-email');
    expect(control?.valid).toBeFalse();
    expect(control?.errors?.['email']).toBeTrue();

    control?.setValue('');
    expect(control?.valid).toBeFalse();
    expect(control?.errors?.['required']).toBeTrue();
  });

  // 測試表單提交成功
  it('表單有效時應該送出並顯示成功訊息', () => {
    spyService.and.returnValue(of({}));
    component.formGroup.setValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      gender: 'male',
      kind: 'meat',
    });

    component.onSubmit();
    expect(spyService).toHaveBeenCalled();
    expect(component.message).toBe('表單提交成功');
  });

  // 測試表單提交失敗
  it('表單無效時不應該送出', () => {
    component.formGroup.get('phone')?.setValue('123'); // 無效號碼
    component.formGroup.get('name')?.setValue('');
    component.formGroup.get('email')?.setValue('invalid-email');
    component.onSubmit();

    expect(spyService).not.toHaveBeenCalled();
    expect(component.message).toBe('');
  });

  // 錯誤訊息顯示
  it('應該顯示正確的錯誤訊息', () => {
    let control = component.formGroup.get('phone');

    control?.setValue('');
    component.formControlInvalid('phone');
    expect(component.showErrorMessage('phone')).toBe('此欄位必須輸入');

    control?.setValue('12345');
    component.formControlInvalid('phone');
    expect(component.showErrorMessage('phone')).toBe('請輸入完整電話號碼');

    control = component.formGroup.get('email');
    control?.setValue('invalid-email');
    component.formControlInvalid('email');
    expect(component.showErrorMessage('email')).toBe('請輸入有效電子信箱');
  });
});
