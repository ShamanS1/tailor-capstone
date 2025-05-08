import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:8084/orders'; // Base URL for the orders API

  constructor(private http: HttpClient) {}

  // Fetch orders for a specific tailor
  getOrdersByTailorId(tailorId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/tailor/${tailorId}`);
  }
  // Fetch orders for a specific tailor
    getOrdersByCustomerId(customerId: number): Observable<Order[]> {
      return this.http.get<Order[]>(`${this.baseUrl}/customer/${customerId}`);
    }

 // Update the status of an order
  updateOrderStatus(orderId: number, newStatus: string): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/status`, { status: newStatus });
  }

 // Fetch order details by order ID
  getOrderDetails(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}/details`);
  }

  createOrder(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Delete an order by ID
  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${orderId}`);
  }
}
