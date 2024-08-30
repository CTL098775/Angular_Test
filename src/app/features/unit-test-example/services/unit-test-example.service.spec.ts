import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UnitTestExampleService } from './unit-test-example.service';
import { UnitTestRequest } from '../models/unit-test-request.model';

describe('UnitTestExampleService', () => {
  let service: UnitTestExampleService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UnitTestExampleService],
    });
    service = TestBed.inject(UnitTestExampleService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('應該呼叫 submitForm 並回應成功訊息', () => {
    const mockResponse = { success: true };
    const formData: UnitTestRequest = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '0970123456',
      gender: 'female',
      kind: 'meat',
    };

    service.submitForm(formData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/submit');
    expect(req.request.method).toBe('POST'); // 驗證 HTTP 方法
    req.flush(mockResponse); // 模擬回應
  });

  it('應該處理 submitForm 中的錯誤', () => {
    const formData: UnitTestRequest = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '0970123456',
      gender: 'female',
      kind: 'meat',
    };

    service.submitForm(formData).subscribe({
      next: () => fail('應該是 500 狀態而失敗'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpTestingController.expectOne(
      'https://example.com/api/submit',
    );
    expect(req.request.method).toBe('POST');
    req.flush('表單提交失敗', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
