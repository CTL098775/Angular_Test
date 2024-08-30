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
      next: () => fail('應該失敗'),
      error: (error) => {
        expect(error.status).toBeGreaterThanOrEqual(400); // toBeGreaterThanOrEqual: >=400
        expect(error.message).toBeDefined();
      },
    });

    const req = httpTestingController.expectOne('http://localhost:3000/submit');
    expect(req.request.method).toBe('POST');
    // 模擬錯誤回應的方式，400是假的
    req.flush('Error', {
      status: 400,
      statusText: 'Bad Request',
    });
  });
});
