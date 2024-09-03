import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UnitTestExampleComponent } from './unit-test-example.component';
import { UnitTestExampleService } from '../services/unit-test-example.service';
import { of, throwError } from 'rxjs';

describe('UnitTestExampleComponent', () => {
  let component: UnitTestExampleComponent;
  let fixture: ComponentFixture<UnitTestExampleComponent>;
  let service: UnitTestExampleService;
  let spyService: jasmine.Spy;
  let alertSpy: jasmine.Spy;

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
    alertSpy = spyOn(window, 'alert');
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
    spyService.and.returnValue(
      of({ status: 'success', message: '表單提交成功' }),
    );
    component.formGroup.setValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      gender: 'male',
      kind: 'meat',
    });

    component.onSubmit();
    expect(spyService).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('表單提交成功');
  });

  // 表單無效
  it('表單無效時不應該送出', () => {
    component.formGroup.get('phone')?.setValue('123'); // 無效號碼
    component.formGroup.get('name')?.setValue('');
    component.formGroup.get('email')?.setValue('invalid-email');
    component.onSubmit();

    expect(spyService).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  // 測試表單提交失敗
  it('表單提交失敗時應該顯示錯誤訊息', () => {
    spyService.and.returnValue(throwError(() => new Error('表單提交失敗')));
    component.formGroup.setValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      gender: 'male',
      kind: 'meat',
    });

    component.onSubmit();
    expect(spyService).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('表單提交失敗');
  });

  // 錯誤訊息顯示
  it('應該顯示正確的錯誤訊息或在沒有錯誤時返回空字串', () => {
    // 將不同的測試情境（欄位、值、預期錯誤）定義為陣列
    const scenarios = [
      { controlName: 'name', value: '', expectedMessage: '此欄位必須輸入' },
      { controlName: 'phone', value: '', expectedMessage: '此欄位必須輸入' },
      {
        controlName: 'phone',
        value: '12345',
        expectedMessage: '請輸入完整電話號碼',
      },
      { controlName: 'phone', value: '1234567890', expectedMessage: '' }, // 無錯誤
      {
        controlName: 'email',
        value: 'invalid-email',
        expectedMessage: '請輸入有效電子信箱',
      },
      { controlName: 'email', value: 'test@example.com', expectedMessage: '' }, // 無錯誤
    ];

    scenarios.forEach(({ controlName, value, expectedMessage }) => {
      const control = component.formGroup.get(controlName);
      control?.setValue(value);
      component.formControlInvalid(controlName); // 更新狀態
      expect(component.showErrorMessage(controlName)).toBe(expectedMessage);
    });
  });
});
