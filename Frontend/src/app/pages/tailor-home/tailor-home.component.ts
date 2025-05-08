import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailsDialogComponent } from '../../components/order-details-dialog/order-details-dialog.component';
import { OrderService } from '../../services/order.service'; // Import the OrderService
import { Order } from '../../models/order.model'; // Import the Order model
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';

@Component({
selector: 'app-tailor-home',
templateUrl: './tailor-home.component.html',
styleUrls: ['./tailor-home.component.css'],
})
export class TailorHomeComponent implements OnInit {



// Table data source
dataSource = new MatTableDataSource<Order>();

// Original data to preserve unfiltered data
originalData: Order[] = [];

// Columns to display in the table
displayedColumns: string[] = [
'orderId',
'customerId',
'dueDate',
'status',
'actions',
];

// Filter fields
orderIdFilter: string = '';
customerIdFilter: string = '';
dueDateFilter: Date | null = null;
statusFilter: string = '';

constructor(
    public dialog: MatDialog,
    private orderService: OrderService,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  // Fetch orders for the logged-in tailor
  fetchOrders(): void {
    const tailorId = Number(localStorage.getItem('id')); // Get tailorId from local storage
    if (tailorId) {
      this.orderService.getOrdersByTailorId(tailorId).subscribe(
        (orders: Order[]) => {
          this.originalData = orders; // Store the original data
          this.dataSource.data = orders; // Set the fetched orders as the table data source
        },
        (error) => {
          console.error('Failed to fetch orders:', error);
        }
      );
    }
  }

  // Apply filters
  applyFilters(): void {
    this.dataSource.data = this.originalData.filter((order) => {
      const orderDeliveryDate = new Date(order.deliveryDate).toDateString(); // Convert to Date object
      const filterDueDate = this.dueDateFilter ? this.dueDateFilter.toDateString() : null;

      return (
        (!this.orderIdFilter ||
          order.orderId.toString().includes(this.orderIdFilter)) &&
        (!this.customerIdFilter ||
          order.customerId.toString().includes(this.customerIdFilter)) &&
        (!this.dueDateFilter || orderDeliveryDate === filterDueDate) &&
        (!this.statusFilter || order.status === this.statusFilter)
      );
    });
  }

  // Clear filters
  clearFilters(): void {
    this.orderIdFilter = '';
    this.customerIdFilter = '';
    this.dueDateFilter = null;
    this.statusFilter = '';
    this.dataSource.data = this.originalData; // Reset to the original data
  }

// Track status changes
  onStatusChange(order: Order): void {
    order.statusChanged = true; // Mark the status as changed
  }

 updateStatus(order: Order): void {
  const url = `http://localhost:8084/orders/${order.orderId}/status`;
  const tailorId = Number(localStorage.getItem('id'));
  
  const body = `"${order.status}"`;

  this.http.put<Order>(url, body, { headers: { 'Content-Type': 'application/json' } }).subscribe(
    (updatedOrder: Order) => {
      console.log('Status updated successfully:', updatedOrder);
      
      // Show success toast
      this.toastService.show(`Order #${order.orderId} status updated to ${order.status}`, 'success');

      // Update local data
      const index = this.originalData.findIndex((o) => o.orderId === order.orderId);
      if (index !== -1) {
        this.originalData[index].status = updatedOrder.status;
        this.originalData[index].statusChanged = false;
      }

      const filteredIndex = this.dataSource.data.findIndex((o) => o.orderId === order.orderId);
      if (filteredIndex !== -1) {
        this.dataSource.data[filteredIndex].status = updatedOrder.status;
        this.dataSource.data[filteredIndex].statusChanged = false;
      }

      // Send notification
      const notificationData = {
        tailorId: tailorId,
        userId: order.customerId,
        orderId: order.orderId,
        message: `Your order #${order.orderId} is ${order.status}`,
        status: 'UNREAD'
      };

      // Send notification to notification service
      this.http.post('http://localhost:8087/notifications/add', notificationData).subscribe(
        response => {
          console.log('Notification sent successfully:', response);
        },
        error => {
          console.error('Failed to send notification:', error);
        }
      );
    },
    (error) => {
      console.error('Failed to update status:', error);
      // Show error toast
      this.toastService.show('Failed to update status', 'error');
    }
  );
}


  // Open order details dialog
  openOrderDetails(order: Order): void {
    this.orderService.getOrderDetails(order.orderId).subscribe(
      (orderDetails: Order) => {
        this.dialog.open(OrderDetailsDialogComponent, {
          width: '600px', // Set a fixed width
          height: '80vh', // Set a fixed height (80% of the viewport height)
          data: orderDetails,
          autoFocus: false, // Prevent auto-focusing on the first focusable element
          restoreFocus: true, // Restore focus to the previously focused element after closing
        });
      },
      (error) => {
        console.error('Failed to fetch order details:', error);
      }
    );
  }
}
