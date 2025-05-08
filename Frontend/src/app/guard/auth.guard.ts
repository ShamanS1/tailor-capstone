import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
providedIn: 'root',
})
export class AuthGuard implements CanActivate {
constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      return true; // Allow access if token exists
    } else {
      this.router.navigate(['/']); // Redirect to login page if no token
      return false;
    }
  }
}
