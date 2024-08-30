import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnitTestRequest } from '../models/unit-test-request.model';

@Injectable({
  providedIn: 'root',
})
export class UnitTestExampleService {
  private apiUrl = 'https://example.com/api/submit';

  constructor(private http: HttpClient) {}

  submitForm(data: UnitTestRequest): Observable<any> {
    // 會失敗
    return this.http.post(this.apiUrl, data);
    // 成功
    // return of({ success: true }).pipe(catchError(this.handleError));
  }
}
