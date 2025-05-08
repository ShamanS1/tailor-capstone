import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Match the Java entity exactly
interface MeasurementRequest {
  userId: number;
  tailorId: number;
  gender: string;
  category: string;
  design: string;
  measurements: string;
  price: number;
}

// Response will include the generated ID
interface MeasurementResponse {
  measurement_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private baseUrl = 'http://localhost:8083/measurements';
  private saveUrl = `${this.baseUrl}/saveMeasurement`;
  private deleteUrl = `${this.baseUrl}/deleteMeasurement`;

  constructor(private http: HttpClient) {}

  createMeasurement(data: any): Observable<any> {
    console.log('Raw input data:', data);

    try {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

      // Log the data before parsing
      console.log('Measurements before parse:', data.measurements);
      console.log('Design before parse:', data.design);

      // Format measurements
      const measurementsString = Object.entries(JSON.parse(data.measurements))
        .map(([key, value]) => `${key}:${value}`)
        .join(',');
      console.log('Formatted measurements:', measurementsString);

      // Format design
      const designObj = JSON.parse(data.design);
      const designString = Object.entries(designObj)
        .map(([key, value]) => `${key}:${value}`)
        .join(',');
      console.log('Formatted design:', designString);

      const requestBody = {
        userId: Number(data.userId),
        tailorId: Number(data.tailorId),
        gender: data.gender,
        category: data.category,
        design: designString,
        measurements: measurementsString,
        price: Number(data.price)
      };

      // Log the final request body
      console.log('Final request body:', JSON.stringify(requestBody, null, 2));

      // Log exact comparison with working Postman request
      console.log('Request validation:');
      console.log('- userId is number:', typeof requestBody.userId === 'number');
      console.log('- tailorId is number:', typeof requestBody.tailorId === 'number');
      console.log('- gender is string:', typeof requestBody.gender === 'string');
      console.log('- category is string:', typeof requestBody.category === 'string');
      console.log('- design is string:', typeof requestBody.design === 'string');
      console.log('- measurements is string:', typeof requestBody.measurements === 'string');
      console.log('- price is number:', typeof requestBody.price === 'number');

      return this.http.post(this.saveUrl, requestBody, { headers });
    } catch (error) {
      console.error('Error formatting measurement data:', error);
      throw error;
    }

  }

  // Delete a measurement by ID
  deleteMeasurement(measurementId: number): Observable<any> {
    return this.http.delete(`${this.deleteUrl}/${measurementId}`);
  }
}
