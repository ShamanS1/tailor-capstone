import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Tailor } from '../models/tailor.model';


@Injectable({
  providedIn: 'root',
})
export class TailorService {
  private baseUrl = 'http://localhost:3000/tailors'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Register a new tailor
  registerTailor(tailor: Tailor): Observable<Tailor> {
    return this.http.post<Tailor>(`${this.baseUrl}/register`, tailor);
  }

// Fetch tailor details by ID
  getTailorById(tailorId: number): Observable<Tailor> {
    return this.http.get<Tailor>(`${this.baseUrl}/${tailorId}`);
  }
// Update tailor details
  updateTailor(tailor: Tailor): Observable<Tailor> {
    return this.http.put<Tailor>(`${this.baseUrl}/put/${tailor.tailorId}`, tailor);
  }

  //get all shops
  getAllShops(): Observable<Tailor[]> {
      return this.http.get<Tailor[]>(`${this.baseUrl}`);
    }

  getTailorsByDressName(dressName: string): Observable<Tailor[]> {
      const params = new HttpParams().set('dressName', dressName);
      return this.http.get<Tailor[]>(`${this.baseUrl}/by-dress-name`, { params });

    }

// private tailorShopsData = [
// { id: 1, name: 'Tailor Shop A', category: ['Suits', 'Ethnic Suit'] ,
// priceList :[
// { name: 'Suits', price: 500 },
// { name: 'Ethnic Suit', price: 700 }
//
// ]},
// { id: 2, name: 'Tailor Shop B', category: ['Blouse', 'Lehenga', 'Churidar Suit'],
// priceList :[
// { name: 'Blouse', price: 500 },
// { name: 'Kurti', price: 700 },
// { name: 'Churidar Suit', price: 1200 }
// ]},
// { id: 3, name: 'Tailor Shop C', category: ['Blouse', 'Lehenga', 'Churidar Suit'],
// priceList :[
// { name: 'Blouse', price: 500 },
// { name: 'Kurti', price: 700 },
// { name: 'Churidar Suit', price: 1200 }
// ]}
// // Add other tailor shops here...
// ];


//   // Method to fetch tailor shops
//   getTailorShops(): Observable<any[]> {
//     return of(this.tailorShopsData); // Return mock data as an observable
//   }
}
