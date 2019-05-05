import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({providedIn: 'root'})
export class AuthService {
  private token: string;
  private expiresIn: number;
  private timmer: any;
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
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authdata)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      this.expiresIn = response.expiresIn;
      if (token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + this.expiresIn * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate);
        this.setTimmer(this.expiresIn);
      }
    });
  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.timmer);
  }

  private saveAuthData(token: string, expiresIn: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiresIn');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expiresIn: new Date(expirationDate)
    };
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const timeLeft = authInformation.expiresIn.getTime() - now.getTime();
    if (timeLeft > 0) {
       this.token = authInformation.token;
       this.isAuthenticated = true;
       this.setTimmer(timeLeft / 1000);
       this.authStatusListener.next(true);
      }
  }

  private setTimmer(duration: number) {
    console.log('setting timmer: ' + duration);
    this.timmer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}


