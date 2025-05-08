import { Component, OnDestroy } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnDestroy {
  toasts: { message: string; type: string; visible: boolean }[] = [];
  private subscription: Subscription;

  constructor(private toastService: ToastService) {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      this.showToast(toast.message, toast.type);
    });
  }

  private showToast(message: string, type: string) {
    const toast = { message, type, visible: true };
    this.toasts.push(toast);

    setTimeout(() => {
      toast.visible = false;
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 300); // Wait for fade out animation
    }, 3000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
} 