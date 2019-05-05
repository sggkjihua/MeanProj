import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({providedIn: 'root'})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  isAuthenticated = false;
  constructor(private http: HttpClient, private router: Router) {}
  getToken() {
    return this.token;
  }

  getStatus() {
    return this.isAuthenticated;
  }
  createUser(email: string, password: string) {
    const authdata: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/user/signup', authdata)
    .subscribe(response => {
      console.log(response);
    });
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(email: string, password: string) {
    const authdata: AuthData = {email, password};
    this.http.post<{token: string}>('http://localhost:3000/api/user/login', authdata)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.authStatusListener.next(false);
  }
}


