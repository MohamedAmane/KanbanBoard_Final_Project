import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8088/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    const authData = btoa(credentials.username + ':' + credentials.password);
    const headers = new HttpHeaders({
      Authorization: `Basic ${authData}`
    });

    return this.http.get(`${this.apiUrl}/boards`, { headers }).pipe(
      tap(() => {
        localStorage.setItem('authData', authData);
        localStorage.setItem('currentUser', credentials.username);
      })
    );
  }

  // 3. Méthode logout améliorée
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
