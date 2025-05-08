import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the models for User and LoginRequest
export interface User {
name: string;
email: string;
phoneNumber: string;
password: string;
}

export interface LoginRequest {
email: string;
password: string;
}

@Injectable({
providedIn: 'root', // Make the service available application-wide
})
export class LoginService {

private apiUrl = 'http://localhost:3000/api/auth'; // Replace with your backend API URL

constructor(private http: HttpClient) {}

  // Method to handle user login
 loginUser(credentials: LoginRequest): Observable<string> {
  return this.http.post(`http://localhost:3000/api/auth/login`, credentials, {
    responseType: 'text', // Tell Angular to expect a plain text response
  });
}

  // Method to handle user registration
  registerUser(user: User): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`http://localhost:3000/api/auth/saveLoginDetails`, user);
  }
}
