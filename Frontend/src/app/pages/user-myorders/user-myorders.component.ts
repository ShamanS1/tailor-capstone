import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { OrderService } from '../../services/order.service';
import { MeasurementService } from '../../services/measurement.service';
import { Order, CustomerDetails, MeasurementDetails } from '../../models/order.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user-myorders',
  templateUrl: './user-myorders.component.html',
  styleUrls: ['./user-myorders.component.css']
})
export class UserMyordersComponent implements OnInit {
  // Filter Variables
  filterOrderId: string = '';
  filterStatus: string = '';
  filterShopName: string = '';
  filterTailorId: string = '';

  // Status Options for Filter
  statusOptions: string[] = ['PENDING', 'COMPLETED', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'YET_TO_PICK_UP', 'PICKED_UP'];

  // Orders Data
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  orderDetailsMap: Map<number, Order> = new Map();

  // Order Details Modal
  isOrderDetailsModalOpen: boolean = false;
  selectedOrder: Order | null = null;

  // Dashboard Data
  totalOrders: number = 0;
  statusChart: any;

  // Add this property
  orderStatusFlow: string[] = [
    'YET_TO_PICK_UP',
    'PICKED_UP',
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'REJECTED'
  ];

  constructor(
    private orderService: OrderService,
    private measurementService: MeasurementService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const customerId = localStorage.getItem('id');
    if (customerId) {
      this.loadOrders(+customerId);
    }
  }

  loadOrders(customerId: number): void {
    this.orderService.getOrdersByCustomerId(customerId).subscribe({
      next: (orders) => {
        console.log('Orders from backend:', orders);  // Check if tailorId is here

        this.orders = orders.map(order => ({
          orderId: order.orderId,
          customerId: order.customerId || customerId,
          tailorId: order.tailorId,  // Ensure this field is populated
          status: order.status,
          orderDate: order.orderDate,
          deliveryDate: order.deliveryDate,
          customerDetails: order.customerDetails || {
            userId: customerId,
            name: 'Loading...',
            email: '',
            phoneNumber: '',
            role: '',
            createdAt: '',
            password: ''
          },
          measurementDetails: order.measurementDetails || {
            measurement_id: 0,
            userId: customerId,
            gender: '',
            category: '',
            design: '',
            measurements: '',
            price: 0
          }
        }));

        this.filteredOrders = [...this.orders];
        this.totalOrders = orders.length;
        this.createStatusChart();

        // Load full details for each order
        this.orders.forEach(order => {
          this.loadOrderDetails(order.orderId);
          console.log(order);  // Check if tailorId is being set correctly
        });
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }


  loadOrderDetails(orderId: number): void {
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (orderDetails) => {
        console.log('Order Details:', orderDetails);  // Check if tailorId is in orderDetails

        // Update both orders and filteredOrders arrays
        const updateOrderInArray = (arr: Order[]) => {
          const index = arr.findIndex(o => o.orderId === orderId);
          if (index !== -1) {
            arr[index] = { ...orderDetails };
          }
        };

        updateOrderInArray(this.orders);
        updateOrderInArray(this.filteredOrders);
        this.orderDetailsMap.set(orderId, orderDetails);
      },
      error: (error) => {
        console.error(`Error loading details for order ${orderId}:`, error);
      }
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const orderIdMatch = !this.filterOrderId ||
        order.orderId.toString().includes(this.filterOrderId);

      const statusMatch = !this.filterStatus ||
        order.status === this.filterStatus;

      const tailorIdMatch = !this.filterTailorId ||
        (order.tailorId && order.tailorId.toString().includes(this.filterTailorId));

      const shopNameMatch = !this.filterShopName ||
        (order.customerDetails && order.customerDetails.name.toLowerCase().includes(this.filterShopName.toLowerCase()));

      return orderIdMatch && statusMatch && tailorIdMatch && shopNameMatch;
    });
  }

  clearFilters(): void {
    this.filterOrderId = '';
    this.filterStatus = '';
    this.filterShopName = '';
    this.filterTailorId = '';
    this.filteredOrders = [...this.orders];
  }

  viewOrderDetails(order: Order): void {
    if (this.orderDetailsMap.has(order.orderId)) {
      this.selectedOrder = this.orderDetailsMap.get(order.orderId) || null;
      this.isOrderDetailsModalOpen = true;
    } else {
      this.loadOrderDetails(order.orderId);
      this.selectedOrder = order;
      this.isOrderDetailsModalOpen = true;
    }
  }

  closeOrderDetailsModal(): void {
    this.isOrderDetailsModalOpen = false;
    this.selectedOrder = null;
  }

  createStatusChart(): void {
    const statusCounts = this.statusOptions.map(status =>
      this.orders.filter(order => order.status === status).length
    );

    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (this.statusChart) {
      this.statusChart.destroy();
    }

    this.statusChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.statusOptions,
        datasets: [{
          label: 'Orders by Status',
          data: statusCounts,
         backgroundColor: [
           '#FF6384', // Pending
           '#36A2EB', // Accepted
           '#4BC0C0', // Completed
           '#FFCE56', // Rejected
           '#FF5733', // In Progress
           '#DAF7A6', // Delivered
           '#900C3F'  // Yet to Pickup
         ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  ngOnDestroy(): void {
    if (this.statusChart) {
      this.statusChart.destroy();
    }
  }

  isStepActive(status: string): boolean {
    if (!this.selectedOrder) return false;
    
    // Show only REJECTED status when order is rejected
    if (this.selectedOrder.status === 'REJECTED') {
      return status === 'REJECTED';
    }
    
    // For non-rejected orders, don't show REJECTED step
    if (status === 'REJECTED') {
      return false;
    }
    
    const currentIndex = this.orderStatusFlow.indexOf(this.selectedOrder.status);
    const stepIndex = this.orderStatusFlow.indexOf(status);
    return stepIndex <= currentIndex && currentIndex !== -1 && stepIndex !== -1;
  }

  isStepCompleted(status: string): boolean {
    if (!this.selectedOrder) return false;
    
    // No steps should show as completed when order is rejected
    if (this.selectedOrder.status === 'REJECTED') {
      return false;
    }
    
    // REJECTED status never shows as completed
    if (status === 'REJECTED') {
      return false;
    }
    
    const currentIndex = this.orderStatusFlow.indexOf(this.selectedOrder.status);
    const stepIndex = this.orderStatusFlow.indexOf(status);
    return currentIndex !== -1 && stepIndex !== -1 && stepIndex < currentIndex;
  }

  formatMeasurementDetails(details: MeasurementDetails): string {
    if (!details) {
      return '';
    }

    let formatted = '';

    // Gender
    if (details.gender) {
      formatted += `Gender: ${details.gender.trim()}\n\n`;
    }

    // Category
    if (details.category) {
      formatted += `Category: ${details.category.trim()}\n\n`;
    }

    // Design
    if (details.design) {
      formatted += 'Design Details:\n';
      try {
        const designPairs = details.design.split(',').map(pair => pair.trim());
        designPairs.forEach(pair => {
          const [key, value] = pair.split(':').map(item => item.trim());
          if (value && value.toLowerCase() !== 'null' && value.toLowerCase() !== 'undefined' && value !== '') {
            const readableKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            formatted += `${readableKey}: ${value}\n`;
          }
        });
        formatted += '\n';
      } catch (error) {
        console.error('Error parsing design:', error);
      }
    }

    // Measurements
    if (details.measurements) {
      formatted += 'Measurements:\n';
      try {
        const measurementPairs = details.measurements.split(',').map(pair => pair.trim());
        measurementPairs.forEach(pair => {
          const [key, value] = pair.split(':').map(item => item.trim());
          if (value && value.toLowerCase() !== 'null' && value.toLowerCase() !== 'undefined' && value !== '') {
            const readableKey = key.charAt(0).toUpperCase() + key.slice(1);
            formatted += `${readableKey}: ${value} cm\n`; // Add 'cm' only for measurements
          }
        });
        formatted += '\n';
      } catch (error) {
        console.error('Error parsing measurements:', error);
      }
    }

    // Price
    if (details.price) {
      formatted += `Price: ₹${details.price}`;
    }

    return formatted;
  }

  getMeasurementEntries(measurements: any): [string, any][] {
    return Object.entries(measurements || {});
  }
  
  formatLabel(label: string): string {
    return label
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  async cancelOrder(order: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: 'Are you sure you want to cancel this order? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.orderService.deleteOrder(order.orderId).toPromise();
          
          if (order.measurementId) {
            await this.measurementService.deleteMeasurement(order.measurementId).toPromise();
          }
          
          this.filteredOrders = this.filteredOrders.filter(o => o.orderId !== order.orderId);
          this.totalOrders--;
          
          // Show success toast
          this.toastService.show('Order cancelled successfully', 'success');
        } catch (error) {
          console.error('Error cancelling order:', error);
          this.toastService.show('Failed to cancel order. Please try again.', 'error');
        }
      }
    });
  }

  // Add new method to check if order is rejected
  isOrderRejected(): boolean {
    return this.selectedOrder?.status === 'REJECTED';
  }
}
