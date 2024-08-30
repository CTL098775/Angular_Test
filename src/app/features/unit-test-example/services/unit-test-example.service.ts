import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnitTestRequest } from '../models/unit-test-request.model';

@Injectable({
  providedIn: 'root',
})
export class UnitTestExampleService {
  // json-server CLI: json-server ./src/assets/mock/api/db.json
  private apiUrl = 'http://localhost:3000/submit';

  constructor(private http: HttpClient) {}

  submitForm(data: UnitTestRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
