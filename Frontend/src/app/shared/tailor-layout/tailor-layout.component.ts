import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { TailorService } from '../../services/tailor.service'; // Import the TailorService
import { Tailor } from '../../models/tailor.model'; // Import the Tailor model
import { Router } from '@angular/router';

@Component({
selector: 'app-tailor-layout',
templateUrl: './tailor-layout.component.html',
styleUrls: ['./tailor-layout.component.css'],
})
export class TailorLayoutComponent implements AfterViewInit , OnInit {
@ViewChild('sidenav') sidenav!: MatSidenav;
isProfileDropdownOpen = false; // Controls profile dropdown visibility


 // Tailor details
  tailor: Tailor | null = null;

  constructor(private tailorService: TailorService, private router: Router) {}



  ngOnInit(): void {
    this.fetchTailorDetails();
  }

ngAfterViewInit() {
    // Close the sidenav initially
    this.sidenav.close();
  }

 // Fetch tailor details using ID
  fetchTailorDetails() {
    const tailorId = localStorage.getItem('id'); // Get tailorId from local storage
    if (tailorId) {
      this.tailorService.getTailorById(+tailorId).subscribe(
        (response: Tailor) => {
          this.tailor = response; // Set the fetched tailor details
        },
        (error) => {
          console.error('Failed to fetch tailor details', error);
        }
      );
    }
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  closeSidenav() {
    this.sidenav.close();
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

 logout() {
     console.log('User logged out');
     // Add logout logic here (e.g., clear session, navigate to login page)
     localStorage.removeItem('authToken'); // Clear the token
     localStorage.removeItem('id'); // Clear the tailor ID
     // Navigate to the login page (you need to import Router and navigate)
     this.router.navigate(['/']);
   }
}
