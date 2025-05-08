import { Component, AfterViewChecked } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service'; // Import the service
import { User, LoginRequest } from '../../models/user.model'; // Import the models
import { TailorService } from '../../services/tailor.service'; // Import the TailorService
import { Tailor, Location, Dress } from '../../models/tailor.model'; // Import the Tailor model
import * as L from 'leaflet';
import { jwtDecode } from 'jwt-decode';
import { LoginService} from '../../services/login.service'; // Import the service and models
import { ToastService } from '../../services/toast.service'; // Add this import


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements AfterViewChecked {

latitude: number | undefined;
longitude: number | undefined;
private map: L.Map | undefined;
private isMapInitialized = false;

// User registration and login models
  user: User = {
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
    password: '',
  };

  loginRequest: LoginRequest = {
    email: '',
    password: '',
  };

  // Tailor registration model
    tailor: Tailor = {
      name: '',
      shopName: '',
      location: { latitude: 0, longitude: 0 },
      email: '',
      phone: '',
      password: '',
      //isDelivery: 'No', // Default value
      dress: [],
    };

  isLoading: boolean = false; // Add loading state

  // Add these properties at the top of the class with other properties
  showLoginPassword = false;
  showCustomerPassword = false;
  showTailorPassword = false;

  // Add these properties
  isErrorPopupOpen = false;
  errorMessage = '';
  lastAttemptedRegistration: 'customer' | 'tailor' | null = null;

  constructor(private userService: UserService, private tailorService: TailorService, private router: Router, private loginService: LoginService, private toastService: ToastService) {

  }




ngAfterViewChecked(): void {
    if (this.isTailorRegistrationPopupOpen && !this.isMapInitialized) {
      this.initMap();
      this.isMapInitialized = true;
    }
  }

isLoginPopupOpen = false;
isRoleSelectionPopupOpen = false;
isCustomerRegistrationPopupOpen = false;
isTailorRegistrationPopupOpen = false;

// For dynamic price inputs
showSuitsPrice = false;
showEthnicSuitPrice = false;
showTrousersPrice = false;
showFormalShirtsPrice = false;
showPathaniSuitPrice = false;
showDesiJacketPrice = false;
showBlousePrice = false;
showKurtiPrice = false;
showAnarkaliSuitPrice = false;
showPunjabiSuitPrice = false;
showChudidarSuitPrice = false;
showLehengaPrice = false;

openLoginPopup() {
    this.isLoginPopupOpen = true;
    setTimeout(() => this.initMap(), 0);
  }

  closeLoginPopup() {
    this.isLoginPopupOpen = false;
    // Reset login form
    this.loginRequest = {
      email: '',
      password: '',
    };
  }

  openRoleSelectionPopup() {
    this.isRoleSelectionPopupOpen = true;
  }

  closeRoleSelectionPopup() {
    this.isRoleSelectionPopupOpen = false;
  }

  openCustomerRegistrationPopup() {
    this.isCustomerRegistrationPopupOpen = true;
    this.isRoleSelectionPopupOpen = false;
  }

  closeCustomerRegistrationPopup() {
    this.isCustomerRegistrationPopupOpen = false;
    // Reset customer registration form
    this.user = {
      name: '',
      email: '',
      address: '',
      phoneNumber: '',
      password: '',
    };
  }

  openTailorRegistrationPopup() {
    this.isTailorRegistrationPopupOpen = true;
    this.isRoleSelectionPopupOpen = false;
  }

 closeTailorRegistrationPopup() {
    this.isTailorRegistrationPopupOpen = false;
    this.isMapInitialized = false;

    // Reset tailor registration form
    this.tailor = {
      name: '',
      shopName: '',
      location: { latitude: 0, longitude: 0 },
      email: '',
      phone: '',
      password: '',
      dress: [],
    };

    // Reset all price toggle flags
    this.showSuitsPrice = false;
    this.showEthnicSuitPrice = false;
    this.showTrousersPrice = false;
    this.showFormalShirtsPrice = false;
    this.showPathaniSuitPrice = false;
    this.showDesiJacketPrice = false;
    this.showBlousePrice = false;
    this.showKurtiPrice = false;
    this.showAnarkaliSuitPrice = false;
    this.showPunjabiSuitPrice = false;
    this.showChudidarSuitPrice = false;
    this.showLehengaPrice = false;

    // Destroy the map if it exists
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

 // Handle customer registration
  onCustomerRegister() {
    this.isLoading = true;
    this.lastAttemptedRegistration = 'customer';
    
    this.userService.registerUser(this.user).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.closeCustomerRegistrationPopup();
        this.toastService.show('Registration successful!', 'success');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error || 'Registration failed. Please try again.';
        this.isErrorPopupOpen = true;
      }
    });
  }

  onLogin() {
  this.loginService.loginUser(this.loginRequest).subscribe(
    (response: string) => {
     // Decode the JWT token
           const decodedToken: any = jwtDecode(response);
           const role = decodedToken.role; // Extract the role
           const id = decodedToken.id; // Extract the ID (tailor ID or customer ID)

           // Store the token and ID in local storage
           localStorage.setItem('authToken', response);
           localStorage.setItem('id', id);

      // Navigate based on the role
      if (role === 'CUSTOMER') {
        this.router.navigate(['/user-home']);
      } else if (role === 'TAILOR') {
        this.router.navigate(['/tailor-home']);
      } else {
        alert('Unknown role. Please contact support.');
      }
    },
    (error) => {
      console.error('Login failed', error);
      alert('Login failed. Please check your credentials.');
    }
  );
}




  // Handle tailor registration
    onTailorRegister() {
       // Filter out dresses with price 0
      this.tailor.dress = this.tailor.dress.filter((d: any) => d.price > 0);

      // Set the location from the map
      if (this.latitude && this.longitude) {
        this.tailor.location = { latitude: this.latitude, longitude: this.longitude };
      }

      // Call the TailorService to register the tailor
      this.isLoading = true; // Set loading to true
      this.tailorService.registerTailor(this.tailor).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.closeTailorRegistrationPopup(); // Close the popup on success
          this.toastService.show('Registration successful!', 'success'); // Update this line
          // Reset the tailor form
          this.tailor = {
            name: '',
            shopName: '',
            location: { latitude: 0, longitude: 0 },
            email: '',
            phone: '',
            password: '',
            dress: [],
          };
          // Reset all price toggle flags
          this.showSuitsPrice = false;
          this.showEthnicSuitPrice = false;
          this.showTrousersPrice = false;
          this.showFormalShirtsPrice = false;
          this.showPathaniSuitPrice = false;
          this.showDesiJacketPrice = false;
          this.showBlousePrice = false;
          this.showKurtiPrice = false;
          this.showAnarkaliSuitPrice = false;
          this.showPunjabiSuitPrice = false;
          this.showChudidarSuitPrice = false;
          this.showLehengaPrice = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error || 'Registration failed. Please try again.';
          this.isErrorPopupOpen = true;
        }
      });
    }
  getDressPrice(dressName: string): number {
    const dress = this.tailor.dress.find((d: any) => d.name === dressName);
    return dress ? dress.price : 0;
  }

  setDressPrice(dressName: string, price: number) {
    const dress = this.tailor.dress.find((d: any) => d.name === dressName);
    if (dress) {
      dress.price = price;
    } else {
      this.tailor.dress.push({ name: dressName, price: price });
    }
  }

  togglePriceInput(dressType: string) {

    const dressIndex = this.tailor.dress.findIndex((d: any) => d.name === dressType);

      if (dressIndex === -1) {
        // If the dress is not in the array, add it with a price of 0
        this.tailor.dress.push({ name: dressType, price: 0 });
      } else {
        // If the dress is already in the array, remove it
        this.tailor.dress.splice(dressIndex, 1);
      }

    switch (dressType) {
      case 'Suits':
        this.showSuitsPrice = !this.showSuitsPrice;
        break;
      case 'Ethnic Suit':
        this.showEthnicSuitPrice = !this.showEthnicSuitPrice;
        break;
      case 'Trousers':
        this.showTrousersPrice = !this.showTrousersPrice;
        break;
      case 'Formal Shirts':
        this.showFormalShirtsPrice = !this.showFormalShirtsPrice;
        break;
      case 'Pathani Suit':
        this.showPathaniSuitPrice = !this.showPathaniSuitPrice;
        break;
      case 'Desi Jacket':
        this.showDesiJacketPrice = !this.showDesiJacketPrice;
        break;
      case 'Blouse':
        this.showBlousePrice = !this.showBlousePrice;
        break;
      case 'Kurti':
        this.showKurtiPrice = !this.showKurtiPrice;
        break;
      case 'Anarkali Suit':
        this.showAnarkaliSuitPrice = !this.showAnarkaliSuitPrice;
        break;
      case 'Punjabi Suit':
        this.showPunjabiSuitPrice = !this.showPunjabiSuitPrice;
        break;
      case 'Chudidar Suit':
        this.showChudidarSuitPrice = !this.showChudidarSuitPrice;
        break;
      case 'Lehenga':
        this.showLehengaPrice = !this.showLehengaPrice;
        break;
    }
  }
  private initMap(): void {
  // Initialize the map with a default view (in case geolocation fails)
  this.map = L.map('tailorMap').setView([51.505, -0.09], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(this.map);

  // Fix for default marker icon path
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  L.Marker.prototype.options.icon = defaultIcon;

  let marker: L.Marker | null = null; // Variable to store the marker

  // Request the user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Set the map view to the user's location
        this.map?.setView([latitude, longitude], 13);

        // Add a marker at the user's location
        marker = L.marker([latitude, longitude]).addTo(this.map!);

        // Optional: Add a popup to the marker
        marker.bindPopup('Your current location').openPopup();

        // Update the form fields with the user's location
        this.latitude = latitude;
        this.longitude = longitude;
      },
      (error) => {
        console.error('Error getting user location:', error);
        alert('Unable to retrieve your location. Using default location.');
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    alert('Geolocation is not supported by your browser. Using default location.');
  }

  // Handle map clicks to update the marker and form fields
  this.map.on('click', (e: L.LeafletMouseEvent) => {
    this.latitude = e.latlng.lat;
    this.longitude = e.latlng.lng;

    // Remove the existing marker (if any)
    if (marker) {
      this.map?.removeLayer(marker);
    }

    // Add a new marker at the clicked location
    marker = L.marker([this.latitude, this.longitude]).addTo(this.map!);

    // Optional: Add a popup to the marker
    marker.bindPopup(`Selected Location: ${this.latitude}, ${this.longitude}`).openPopup();
  });
}


  useMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Set the map view to the user's location
        this.map?.setView([latitude, longitude], 13);

        // Add a marker at the user's location
        const marker = L.marker([latitude, longitude]).addTo(this.map!);

        // Optional: Add a popup to the marker
        marker.bindPopup('Your current location').openPopup();

        // Update the form fields with the user's location
        this.latitude = latitude;
        this.longitude = longitude;
      },
      (error) => {
        console.error('Error getting user location:', error);
        alert('Unable to retrieve your location.');
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    alert('Geolocation is not supported by your browser.');
  }
}

// Add this method to handle password visibility
togglePasswordVisibility(type: 'login' | 'customer' | 'tailor') {
  switch (type) {
    case 'login':
      this.showLoginPassword = !this.showLoginPassword;
      break;
    case 'customer':
      this.showCustomerPassword = !this.showCustomerPassword;
      break;
    case 'tailor':
      this.showTailorPassword = !this.showTailorPassword;
      break;
  }
}

retryRegistration() {
  this.closeErrorPopup();
  if (this.lastAttemptedRegistration === 'customer') {
    this.openCustomerRegistrationPopup();
  } else if (this.lastAttemptedRegistration === 'tailor') {
    this.openTailorRegistrationPopup();
  }
}

closeErrorPopup() {
  this.isErrorPopupOpen = false;
  this.errorMessage = '';
}
}



