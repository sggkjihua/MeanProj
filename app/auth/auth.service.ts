import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {

  }
  createUser(email: string, password: string) {
    const authdata: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/user/signup', authdata)
    .subscribe(response => {
      console.log(response);
    });
  }
  login(email: string, password: string) {
    const authdata: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/user/login', authdata)
    .subscribe(response => {
      console.log(response);
    });
  }
}


