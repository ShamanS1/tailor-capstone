import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.css']
})
export class OrderDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {
    // Disable the default dialog scrolling
    dialogRef.disableClose = true;
    // Remove default dialog padding
    dialogRef.addPanelClass('no-padding-dialog');
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
