import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private loggedIn = new BehaviorSubject<boolean>(false); // 用來跟蹤登錄狀態
  isLoggedIn = this.loggedIn.asObservable(); // 登錄狀態的可觀察對象

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      tap((response: any) => {
        if (response && response.token) {
          // 假設返回的 response 中有 token 字段
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true); // 更新登錄狀態
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem('token'); // 清除 token
    this.loggedIn.next(false); // 更新登錄狀態
  }
}
