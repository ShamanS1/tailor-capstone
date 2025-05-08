export interface Order {
  orderId: number; // Unique identifier for the order
customerId: number; // ID of the customer who placed the order
orderDate: string; // ISO date string (e.g., "2023-10-15T12:34:56Z")
  deliveryDate: string; // ISO date string (e.g., "2023-10-25T12:34:56Z")
  status: string; // Order status: PENDING, COMPLETED, ACCEPTED, REJECTED
  customerDetails: CustomerDetails; // Nested customer details
  measurementDetails: MeasurementDetails; // Nested measurement details
  statusChanged?: boolean; // Optional flag to track if the status has been changed
  tailorId: number;
}

export interface CustomerDetails {
  userId: number; // Unique identifier for the customer
  name: string; // Name of the customer
  email: string; // Email address of the customer
  password: string; // Password (hashed or encrypted)
  role: string; // Role: CUSTOMER, TAILOR, etc.
  phoneNumber: string; // Contact number of the customer
  createdAt: string; // ISO date string (e.g., "2023-10-01T12:34:56Z")
}

export interface MeasurementDetails {
  measurement_id: number; // Unique identifier for the measurement
  userId: number; // ID of the user associated with the measurement
  gender: string; // Gender: MALE, FEMALE, etc.
  category: string; // Category: Shirt, Pant, etc.
  design: string; // Design: Formal, Casual, etc.
  measurements: string; // Comma-separated measurements (e.g., "chest:40,waist:32")
  price: number; // Price of the order
}
