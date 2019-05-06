import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({providedIn: 'root'})
export class AuthService {
  BACKEND_URL = environment.url;
  private token: string;
  private userId: string;
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
    this.http.post(this.BACKEND_URL + '/user/signup', authdata)
    .subscribe(response => {
      console.log(response);
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(email: string, password: string) {
    const authdata: AuthData = {email, password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(this.BACKEND_URL + '/user/login', authdata)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      this.expiresIn = response.expiresIn;
      if (token) {
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + this.expiresIn * 1000);
        this.saveAuthData(token, expirationDate, this.userId);
        this.setTimmer(this.expiresIn);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  getUserId() {
    return this.userId;
  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.userId = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.timmer);

  }

  private saveAuthData(token: string, expiresIn: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiresIn');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expiresIn: new Date(expirationDate),
      userId
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
       this.userId = authInformation.userId;
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


