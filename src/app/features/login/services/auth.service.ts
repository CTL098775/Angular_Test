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
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((users) => {
        // 在前端進行模擬驗證
        const user = users.find(
          (user) =>
            user.username === data.username && user.password === data.password,
        );

        if (user) {
          localStorage.setItem('token', 'mock-token'); // 存儲 token 到 localStorage
          this.loggedIn.next(true); // 更新登錄狀態
        } else {
          throw new Error('Invalid credentials');
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem('token'); // 清除 token
    this.loggedIn.next(false); // 更新登錄狀態
  }
}
