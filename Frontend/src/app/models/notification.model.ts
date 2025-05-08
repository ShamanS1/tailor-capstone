// src/app/models/notification.model.ts

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

export interface Notification {
  id: number; // Primary key
  tailorId: number; // ID of the tailor
  userId: number; // ID of the customer
  orderId: number; // ID of the order
  message: string; // Notification message
  status: NotificationStatus; // Enum for notification status
}
