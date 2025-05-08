// src/app/services/notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification, NotificationStatus } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl = 'http://localhost:8087/notifications'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Fetch unread notifications for a user
  getUnreadNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/unread/${userId}`);
  }

  markNotificationAsRead(notificationId: number): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/readNotification/${notificationId}`, null, {
      responseType: 'text' as 'json', // Handle plain text response
    });
  }
}
