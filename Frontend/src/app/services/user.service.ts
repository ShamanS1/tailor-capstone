import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, LoginRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Register a new user
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }

  // Login a user
  loginUser(loginRequest: LoginRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/login`, loginRequest, {
      responseType: 'text' as 'json', // Handle plain text response
    });
  }
// Fetch user details by ID
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }
  // Get user details by ID
  getUserDetailsById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/all`);
  }

  // Update user details
  updateUser(id: number, updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, updatedUser);
  }

  // Delete a user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
