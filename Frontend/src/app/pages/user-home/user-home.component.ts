import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { TailorService } from 'src/app/services/tailor.service';
import jsPDF from 'jspdf';
import { Tailor, Dress } from '../../models/tailor.model';
import * as L from 'leaflet';
import { MeasurementService } from 'src/app/services/measurement.service'; // Add MeasurementService
import { OrderService } from 'src/app/services/order.service'; // Add OrderService
import html2canvas from 'html2canvas';
import { ToastService } from '../../services/toast.service';

// Add Gender enum to match backend
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

// Update interface to match exact database column order
interface OrderData {
  orderId?: number;           // '5'
  clothType: string;          // 'Not Specified'
  clothColor: string;         // 'Not Specified'
  customerId: number;         // '20250127001'
  orderDate: string;          // '2025-02-06 17:16:07.414000'
  measureId: number;          // '22'
  deliveryDate: string;       // '2025-01-30 17:16:07.414000'
  shopName: string;          // 'ChaitanyaShop'
  status: string;            // 'YET_TO_PICK_UP'
  tailorId: number;          // '27012025001'
  willProvideCloth: boolean; // '1'
}

// Update interface to match backend entity exactly
interface MeasurementData {
  measurement_id: number | null;
  userId: number;
  tailorId: number;
  gender: Gender;
  category: string;
  design: string;
  measurements: string;
  price: number;
}

@Component({
selector: 'app-order',
templateUrl: './user-home.component.html',
styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
// isShopDetailsModalOpen: boolean = false;
// selectedShopDetails: any = null;
// private map: any; // Leaflet map instance
isShopDetailsModalOpen: boolean = false;
selectedShopDetails: Tailor | null = null; // Use the Tailor model for type safety
private map: L.Map | null = null; // Store the Leaflet map instance

// Existing properties
isDressDetailsModalOpen: boolean = false; // New property for dress details modal

// Add the missing property
selectedGender: string = 'male';  // Default to male

genderForm: FormGroup;
dressCategories: any[] = [];
tailorShops: any[] = [];
measurementForm: FormGroup;
selectedDress: any = null;
selectedShop: any = null;
designOptions: any = {};
price: number = 0;
billDetails: any = null;
isDesignModalOpen: boolean = false;
isMeasurementModalOpen: boolean = false;
isBillModalOpen: boolean = false;

// Mock data for dress categories
maleDresses = [
{
id: 1,
name: 'Suits',
image: 'assets/images/suit.jpg',
description:"A classic and timeless formal attire, perfect for business meetings, weddings, and upscale events. Available in various styles, including single-breasted and double-breasted designs. Tailor your suit to perfection with options for lapel types, sleeve lengths, and vent styles.",
measurementFields: [
{ label: 'Chest', name: 'chest', placeholder: 'Chest in inches' },
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Shoulder', name: 'shoulder', placeholder: 'Shoulder width in inches' },
{ label: 'Length', name: 'length', placeholder: 'Suit length in inches' },
{ label: 'Sleeve', name: 'sleeve', placeholder: 'Sleeve length in inches' }
],
designOptions: {
neckTypes: ['Notch Lapel', 'Peak Lapel', 'Shawl Collar'],
sleeveTypes: ['Full Sleeve'],
cuts: ['Single Breasted', 'Double Breasted'],
otherOptions: ['Ventless', 'Single Vent', 'Double Vent']
}
},
{
id: 2,
name: 'Ethnic Suit',
image: 'assets/images/MensEthenicWear.jpg',
description:"A traditional outfit combining elegance and cultural charm. Ideal for festive occasions, weddings, or celebrations. Features intricate embroidery and unique necklines, including mandarin collars and round necks.",
measurementFields: [
{ label: 'Chest', name: 'chest', placeholder: 'Chest in inches' },
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Shoulder', name: 'shoulder', placeholder: 'Shoulder width in inches' },
{ label: 'Length', name: 'length', placeholder: 'Kurta length in inches' },
{ label: 'Sleeve', name: 'sleeve', placeholder: 'Sleeve length in inches' },
{ label: 'Neck', name: 'neck', placeholder: 'Neck circumference in inches' }
],
designOptions: {
neckTypes: ['Round Neck', 'V-Neck', 'Mandarin Collar'],
sleeveTypes: ['Short Sleeve', 'Full Sleeve'],
cuts: ['Straight Cut', 'A-Line'],
otherOptions: ['Side Slits', 'Embroidered Designs']
}
},
{
id: 3,
name: 'Trousers',
image: 'assets/images/MensTrousers.jpg',
description: "Essential for every wardrobe, these trousers offer comfort and versatility. Choose from slim fit, regular fit, or relaxed fit styles to suit formal or casual occasions. Additional options include pleated, flat-front, and cuffed designs.",
measurementFields: [
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Hip', name: 'hip', placeholder: 'Hip in inches' },
{ label: 'Length', name: 'length', placeholder: 'Length in inches' },
{ label: 'Inseam', name: 'inseam', placeholder: 'Inseam length in inches' },
{ label: 'Thigh', name: 'thigh', placeholder: 'Thigh circumference in inches' }
],
designOptions: {
cuts: ['Slim Fit', 'Regular Fit', 'Relaxed Fit'],
otherOptions: ['Pleated', 'Flat Front', 'Cuffed Bottom']
}
},
{
id: 4,
name: 'Formal Shirts',
image: 'assets/images/MensFormal.jpg',
description:"Tailored for style and sophistication, formal shirts are perfect for office wear and special events. Options include spread collars, point collars, and mandarin collars, with pocket and button-down designs available.",
measurementFields: [
{ label: 'Chest', name: 'chest', placeholder: 'Chest in inches' },
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Shoulder', name: 'shoulder', placeholder: 'Shoulder width in inches' },
{ label: 'Sleeve', name: 'sleeve', placeholder: 'Sleeve length in inches' },
{ label: 'Length', name: 'length', placeholder: 'Shirt length in inches' },
{ label: 'Collar', name: 'collar', placeholder: 'Collar size in inches' }
],
designOptions: {
neckTypes: ['Spread Collar', 'Point Collar', 'Mandarin Collar'],
sleeveTypes: ['Short Sleeve', 'Long Sleeve'],
cuts: ['Slim Fit', 'Regular Fit'],
otherOptions: ['Pocket', 'No Pocket', 'Button-down Collar']
}
},
{
id: 5,
name: 'Pathani Suit',
image: 'assets/images/pathani suit.jpg',
description:"A versatile and elegant traditional outfit that combines style with comfort. Often worn during cultural events or celebrations, it features unique necklines, embroidered designs, and practical additions like front or side pockets.",
measurementFields: [
{ label: 'Chest', name: 'chest', placeholder: 'Chest in inches' },
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Shoulder', name: 'shoulder', placeholder: 'Shoulder width in inches' },
{ label: 'Sleeve', name: 'sleeve', placeholder: 'Sleeve length in inches' },
{ label: 'Length', name: 'length', placeholder: 'Suit length in inches' },
{ label: 'Collar', name: 'collar', placeholder: 'Collar size in inches' },
{ label: 'Bottom Length', name: 'bottomLength', placeholder: 'Bottom length in inches' }
],
designOptions: {
neckTypes: ['Mandarin Collar', 'Spread Collar'],
sleeveTypes: ['Short Sleeve', 'Long Sleeve'],
styles: ['Plain', 'Embroidered'],
otherOptions: ['Button-down', 'Side Pockets', 'Front Pockets']
}
},
{
id: 6,
name: 'Desi Jacket',
image: 'assets/images/jacket.jpg',
description: "A stylish ethnic jacket that adds sophistication to any attire. Available in silk, cotton, or linen, these jackets come with various neck designs, button styles, and embroidered options for a refined look.",
measurementFields: [
{ label: 'Chest', name: 'chest', placeholder: 'Chest in inches' },
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Shoulder', name: 'shoulder', placeholder: 'Shoulder width in inches' },
{ label: 'Length', name: 'length', placeholder: 'Jacket length in inches' },
{ label: 'Armhole', name: 'armhole', placeholder: 'Armhole size in inches' },
{ label: 'Neck Depth', name: 'neckDepth', placeholder: 'Neck depth in inches' }
],
designOptions: {
neckTypes: ['V-Neck', 'Mandarin Collar', 'Round Neck'],
buttonTypes: ['Single-Breasted', 'Double-Breasted'],
fabricTypes: ['Silk', 'Cotton', 'Linen'],
otherOptions: ['With Pocket', 'Without Pocket', 'Embroidered']
}
}

];

femaleDresses = [
{
id: 1,
name: 'Blouse',
image: 'assets/images/WomensBlouse.jpg',
description:"A chic and versatile upper garment, designed to pair with sarees or lehengas. Customizable with various sleeve types, necklines, and intricate back designs like keyhole or backless styles.",
measurementFields: [
{ label: 'Bust', name: 'bust', placeholder: 'Bust in inches' },
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Shoulder', name: 'shoulder', placeholder: 'Shoulder width in inches' },
{ label: 'Length', name: 'length', placeholder: 'Blouse length in inches' },
{ label: 'Sleeve', name: 'sleeve', placeholder: 'Sleeve length in inches' },
{ label: 'Armhole', name: 'armhole', placeholder: 'Armhole circumference in inches' }
],
designOptions: {
sleeveType: ['Full Sleeve', 'Half Sleeve', 'Sleeveless', 'Cap Sleeve'],
neckline: ['Round Neck', 'V Neck', 'Boat Neck', 'Collar Neck'],
backDesign: ['Keyhole', 'Backless', 'Buttoned', 'Plain']
}
},
{
id: 2,
name: 'Kurti',
image: 'assets/images/kurtha.jpg',
description: "A comfortable and stylish outfit suitable for casual or semi-formal occasions. Available in straight, flared, or asymmetrical hemlines, with diverse necklines and sleeve options to match your preference.",
measurementFields: [
{ label: 'Bust', name: 'bust', placeholder: 'Bust in inches' },
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Hip', name: 'hip', placeholder: 'Hip in inches' },
{ label: 'Length', name: 'length', placeholder: 'Kurti length in inches' },
{ label: 'Sleeve', name: 'sleeve', placeholder: 'Sleeve length in inches' }
],
designOptions: {
sleeveType: ['3/4 Sleeve', 'Full Sleeve', 'Sleeveless'],
neckline: ['Round Neck', 'Mandarin Collar', 'Sweetheart Neck'],
hemline: ['Straight', 'Flared', 'Asymmetrical']
}
},
{
id: 3,
name: 'Anarkali Suit',
image: 'assets/images/AnarkaliSuit.jpg',
description:"A regal and elegant outfit, known for its high, medium, or low flare designs. Perfect for weddings and festive occasions, it features luxurious fabrics, ornate patterns, and stunning necklines.",
measurementFields: [
{ label: 'Bust', name: 'bust', placeholder: 'Bust in inches' },
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Hip', name: 'hip', placeholder: 'Hip in inches' },
{ label: 'Shoulder', name: 'shoulder', placeholder: 'Shoulder width in inches' },
{ label: 'Length', name: 'length', placeholder: 'Suit length in inches' },
{ label: 'Sleeve', name: 'sleeve', placeholder: 'Sleeve length in inches' }
],
designOptions: {
flare: ['High Flare', 'Medium Flare', 'Low Flare'],
sleeveType: ['Full Sleeve', 'Half Sleeve', 'Sleeveless'],
neckline: ['Round Neck', 'Deep V Neck', 'Square Neck']
}
},
{
id: 4,
name: 'Punjabi Suit',
image: 'assets/images/PunjabiSuits.jpg',
description:"A vibrant and comfortable ethnic outfit comprising a kameez, salwar, and dupatta. Known for its unique salwar styles like Patiala and dhoti, it is adorned with embroidered or printed designs, complemented by elegant dupattas.",
measurementFields: [
{ label: 'Bust', name: 'bust', placeholder: 'Bust in inches' },
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Hip', name: 'hip', placeholder: 'Hip in inches' },
{ label: 'Shoulder', name: 'shoulder', placeholder: 'Shoulder width in inches' },
{ label: 'Length', name: 'length', placeholder: 'Suit length in inches' },
{ label: 'Sleeve', name: 'sleeve', placeholder: 'Sleeve length in inches' },
{ label: 'Salwar Length', name: 'salwarLength', placeholder: 'Salwar length in inches' }
],
designOptions: {
salwarType: ['Patiala', 'Straight Cut', 'Dhoti Style'],
kameezPattern: ['Printed', 'Plain', 'Embroidered'],
dupattaStyle: ['Heavy Work', 'Simple', 'Bordered']
}
},
{
id: 5,
name: 'Chudidar Suit',
image: 'assets/images/chudidarSuit.jpg',
description:"A classic traditional outfit, perfect for formal events or celebrations. Features a snug-fitting churidar paired with a well-tailored kameez. Customizable with stylish necklines, sleeve designs, and churidar fits.",
measurementFields: [
{ label: 'Bust', name: 'bust', placeholder: 'Bust in inches' },
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Hip', name: 'hip', placeholder: 'Hip in inches' },
{ label: 'Shoulder', name: 'shoulder', placeholder: 'Shoulder width in inches' },
{ label: 'Length', name: 'length', placeholder: 'Suit length in inches' },
{ label: 'Sleeve', name: 'sleeve', placeholder: 'Sleeve length in inches' },
{ label: 'Churidar Length', name: 'churidarLength', placeholder: 'Churidar length in inches' }
],
designOptions: {
churidarStyle: ['Tight Fit', 'Loose Fit'],
sleeveType: ['Full Sleeve', 'Half Sleeve', 'Sleeveless'],
neckline: ['Round Neck', 'Deep Neck', 'Boat Neck']
}
},
{
id: 6,
name: 'Lehenga',
image: 'assets/images/Lehenga.jpg',
description: "A grand and luxurious ethnic attire for weddings and festive events. Features flared, mermaid, or straight-cut lehengas, paired with exquisitely designed blouses. Dupattas with intricate embroidery add a touch of elegance.",
measurementFields: [
{ label: 'Waist', name: 'waist', placeholder: 'Waist in inches' },
{ label: 'Hip', name: 'hip', placeholder: 'Hip in inches' },
{ label: 'Length', name: 'length', placeholder: 'Lehenga length in inches' },
{ label: 'Blouse Bust', name: 'blouseBust', placeholder: 'Blouse bust in inches' },
{ label: 'Blouse Waist', name: 'blouseWaist', placeholder: 'Blouse waist in inches' },
{ label: 'Blouse Length', name: 'blouseLength', placeholder: 'Blouse length in inches' },
{ label: 'Sleeve', name: 'sleeve', placeholder: 'Blouse sleeve length in inches' }
],
designOptions: {
lehengaStyle: ['Flared', 'Mermaid', 'Straight Cut'],
blouseStyle: ['Embroidered', 'Sequined', 'Plain'],
dupattaStyle: ['Heavy Work', 'Plain', 'Bordered']
}
}
];



measurementFields: any[] = [];
designForm: FormGroup;

constructor(private fb: FormBuilder,
    private tailorService: TailorService,
    private router: Router, // Inject Router
 private measurementService: MeasurementService, // Inject MeasurementService
    private orderService: OrderService, // Inject OrderService
    private toastService: ToastService  // Add this
    ) {
   this.genderForm = this.fb.group({

         gender: ['male', Validators.required] // Default to 'male'
       });
    this.measurementForm = this.fb.group({});
    this.designForm = this.fb.group({
               willProvideCloth: [true, Validators.required], // Default to "Yes"
                     clothType: [''], // Will only be used if "No" is selected
                     clothColor: [''],
             });
  }

  ngOnInit(): void {

     this.updateDressCategories('male');
    // Listen to changes in the gender form control
    this.genderForm.get('gender')?.valueChanges.subscribe((value) => {
      if (value) {
        this.updateDressCategories(value);
      }
    });
  }
selectGender(gender: string) {
  this.selectedGender = gender;
  // Replace filterDressCategories with updateDressCategories
  this.updateDressCategories(gender);
  
  // Add smooth scrolling to category section
  setTimeout(() => {
    const categorySection = document.getElementById('category-section');
    if (categorySection) {
      categorySection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  }, 100);
}

// Navigation methods
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  logout() {
  localStorage.removeItem('authToken'); // Clear the token
  this.router.navigate(['/']); // Redirect to the login page
}

  updateDressCategories(gender: string): void {
    this.dressCategories = gender === 'male' ? this.maleDresses : this.femaleDresses;
    this.selectedDress = null; // Reset selected dress when gender changes
    this.selectedShop = null; // Reset selected shop when gender changes
  }

// Method to open the dress details modal
  openDressDetailsModal(dress: any): void {
    this.selectedDress = dress;
    this.isDressDetailsModalOpen = true;
  }

  // Method to close the dress details modal
  closeDressDetailsModal(): void {
    this.isDressDetailsModalOpen = false;
    //this.selectedDress = null; // Reset selected dress
  }



 selectDress(dress: any): void {

  this.selectedDress = dress;
  this.designOptions = dress.designOptions; // Load design options specific to the dress

  // Fetch tailor shops that support the selected dress category using getTailorsByDressName
  this.tailorService.getTailorsByDressName(dress.name).subscribe((tailors) => {
    this.tailorShops = tailors.map((tailor) => {
      const price = this.getPriceForDress(tailor, dress.name);
      console.log(price);

      return {
        ...tailor,
        price, // Add price for the selected dress
      };
    });

    // Scroll to tailor shops section
    setTimeout(() => {
      const element = document.getElementById('tailor-shops');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  });


   this.closeDressDetailsModal();
 }


   onDressSelect(dress: any): void {
      this.openDressDetailsModal(dress);
    }

getPriceForDress(tailor: Tailor, dressName: string): number {
  console.log(tailor);
  if (!tailor.dress || tailor.dress.length === 0) {
    console.log("No dresses available for tailor:", tailor.name);
    return 0; // Return 0 if there are no dresses
  }

  const dress = tailor.dress.find((d: Dress) => d.name === dressName);
  if (dress) {
    console.log(`Price for ${dressName} in ${tailor.shopName}:`, dress.price);
  } else {
    console.log(`Dress ${dressName} not found in ${tailor.shopName}`);
  }
  return dress ? dress.price : 0; // Return the price if found, otherwise 0
}



//     getPriceForDress(tailor: Tailor, dressName: string): number {
//       const dress = tailor.dresses.find((d: Dress) => d.name === dressName);
//       return dress ? dress.price : 0;
//     }

// Update the viewShopDashboard method to open the modal instead of navigating
  viewShopDashboard(shopId: number): void {
    const shop = this.tailorShops.find((s) => s.id === shopId);
    if (shop) {
      this.openShopDetailsModal(shop);
    }
  }



  onShopSelect(shop: any): void {
    this.selectedShop = shop;
console.log("selectedSHop", this.selectedShop );
    this.openDesignModal(); // Open design options modal after selecting a shop
  }

  openDesignModal(): void {
    this.isDesignModalOpen = true;

    // Reset and initialize the design form
    //this.designForm = this.fb.group({});
    if (this.designOptions) {
      Object.keys(this.designOptions).forEach((key) => {
        this.designForm.addControl(key, this.fb.control('', Validators.required));
      });
    }
  }

  closeDesignModal(): void {
    this.isDesignModalOpen = false;
  }

  // Handle cloth material change
    onClothMaterialChange(value: boolean) {
      if (value) {
        this.designForm.patchValue({ clothType: '', clothColor: '' }); // Clear inputs
      }
    }

   saveDesignOptions() {
      if (this.designForm.invalid) {
        this.toastService.show('Please fill all required fields.', 'error');
        return;
      }

      const designData = this.designForm.value;
      console.log('Design Data:', designData);

      this.closeDesignModal();
      // Automatically open measurement modal after closing design modal
      this.openMeasurementModal();
    }

  openMeasurementModal(): void {
    this.isMeasurementModalOpen = true;
    this.measurementFields = this.selectedDress.measurementFields;

    // Reset and initialize the measurement form
    this.measurementForm = this.fb.group({});
    this.measurementFields.forEach((field: any) => {
      this.measurementForm.addControl(field.name, this.fb.control('', Validators.required));
    });
  }

  closeMeasurementModal(): void {
    this.isMeasurementModalOpen = false;
  }

  calculatePrice(): void {
    if (!this.measurementForm.valid) {
      this.toastService.show('Please fill all measurement fields', 'error');
      return;
    }

    const measurements = this.measurementForm.value;
    // Mock price calculation logic
    this.price = 1000; // Replace with actual calculation
    this.closeMeasurementModal();
  }

  openBillModal(): void {
    this.generateBill();
    this.isBillModalOpen = true;
  }

  closeBillModal(): void {
    this.isBillModalOpen = false;
    
    // Reset all form data and selections
    this.resetAllData();
  }

  // Add new method to reset all data
  private resetAllData(): void {
    // Reset forms
    this.genderForm.reset({ gender: 'male' });
    this.measurementForm.reset();
    this.designForm.reset({
      willProvideCloth: true,
      clothType: '',
      clothColor: ''
    });

    // Reset selections
    this.selectedDress = null;
    this.selectedShop = null;
    this.selectedShopDetails = null;
    this.billDetails = null;
    this.price = 0;

    // Reset modal states
    this.isDesignModalOpen = false;
    this.isMeasurementModalOpen = false;
    this.isBillModalOpen = false;
    this.isShopDetailsModalOpen = false;
    this.isDressDetailsModalOpen = false;

    // Update dress categories to initial state
    this.updateDressCategories('male');

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

 downloadBill() {
   const billElement = document.getElementById('bill-content');

   if (billElement) {
     const newWindow = window.open('', '', 'width=800,height=1000');

     if (newWindow) {
       newWindow.document.write(`
         <html>
         <head>
           <title>Bill Details</title>
           <style>
             body { font-family: Arial, sans-serif; padding: 20px; }
             .bill-table { width: 100%; border-collapse: collapse; }
             .bill-table th, .bill-table td { border: 1px solid #000; padding: 8px; text-align: left; }
             .section-header { background-color: #f7b162; color: black; font-weight: bold; }
           </style>
         </head>
         <body>
           ${billElement.innerHTML}
           <script>
             setTimeout(() => { window.print(); window.close(); }, 500);
           <\/script>
         </body>
         </html>
       `);
       newWindow.document.close();
     }
   }
 }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

// // Method to open the shop details modal
//   openShopDetailsModal(shop: any): void {
//     this.selectedShopDetails = shop;
//     this.isShopDetailsModalOpen = true;
//
//     // Initialize the Leaflet map after the modal is opened
//     setTimeout(() => {
//       this.initMap();
//     }, 0);
//   }
// Method to open the shop details modal
openShopDetailsModal(shopId: number): void {
  this.isShopDetailsModalOpen = true;

  // Fetch shop details from the backend
  this.tailorService.getTailorById(shopId).subscribe(
    (data: Tailor) => {
      this.selectedShopDetails = data; // Assign fetched data to selectedShopDetails
    console.log(data);
      // Initialize the Leaflet map after the modal is opened and data is fetched
      setTimeout(() => {
        this.initMap();
      }, 0);
    },
    (error) => {
      console.error('Error fetching shop details:', error);
      this.isShopDetailsModalOpen = false; // Close the modal if there's an error
    }
  );
}

  // Method to close the shop details modal
  closeShopDetailsModal(): void {
    this.isShopDetailsModalOpen = false;
    if (this.map) {
      this.map.remove(); // Clean up the map when the modal is closed
    }
  }

//   // Method to initialize the Leaflet map
//   private initMap(): void {
//     // Default coordinates (you can replace these with the shop's actual coordinates)
//     const defaultLat = 28.6139; // Example: New Delhi
//     const defaultLng = 77.2090;
//
//     // Initialize the map
//     this.map = L.map('shop-map').setView([defaultLat, defaultLng], 13);
//
//     // Add a tile layer (you can use any tile layer, e.g., OpenStreetMap)
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(this.map);
//
//     // Add a marker for the shop's location
//     L.marker([defaultLat, defaultLng])
//       .addTo(this.map)
//       .bindPopup('Shop Location')
//       .openPopup();
//   }
// Method to initialize the Leaflet map
private initMap(): void {
  // Check if the map container exists
  const mapContainer = document.getElementById('shop-map');
  if (!mapContainer) {
    console.error('Map container not found');
    return;
  }

  // Use the shop's coordinates if available, otherwise use default coordinates
  const shopLat = this.selectedShopDetails?.location?.latitude || 28.6139; // Default: New Delhi
  const shopLng = this.selectedShopDetails?.location?.longitude || 77.2090;

  // Initialize the map
  this.map = L.map('shop-map').setView([shopLat, shopLng], 13);

  // Add a tile layer (e.g., OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);

  // Add a marker for the shop's location
  L.marker([shopLat, shopLng])
    .addTo(this.map)
    .bindPopup('Shop Location')
    .openPopup();
}

 generateBill(): void {
  if (!this.validateOrderData()) {
    return;
  }

  const userId = localStorage.getItem('id');
  if (!userId) {
    alert('Please log in to place an order');
    return;
  }

  // Create the billDetails object with initial data
  this.billDetails = {
    customerId: Number(userId),
    customerName: localStorage.getItem('name') || 'Customer',
    tailorId: Number(this.selectedShop.tailorId),
    shopName: this.selectedShop.shopName,
    orderDate: new Date(),
    deliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    gender: this.genderForm.get('gender')?.value?.toUpperCase() || 'MALE',
    dress: this.selectedDress,
    measurements: this.measurementForm.value,
    design: this.designForm.value,
    price: Number(this.selectedShop.price) || 0
  };

  console.log('Generated bill details:', this.billDetails);
  this.sendMeasurementData();
}

private validateOrderData(orderData?: any): boolean {
  // Case 1: Validating initial form data before generating bill
  if (!orderData) {
    if (!this.selectedShop?.tailorId) {
      this.toastService.show('Please select a valid shop', 'error');
      return false;
    }

    if (!this.selectedDress?.name) {
      this.toastService.show('Please select a valid dress', 'error');
      return false;
    }

    if (!this.measurementForm.valid) {
      this.toastService.show('Please fill in all measurement fields', 'error');
      console.log('Invalid measurements:', this.measurementForm.value);
      return false;
    }

    if (!this.designForm.valid) {
      this.toastService.show('Please fill in all design options', 'error');
      console.log('Invalid design options:', this.designForm.value);
      return false;
    }

    if (!this.genderForm.valid) {
      this.toastService.show('Please select a gender', 'error');
      return false;
    }

    return true;
  }

  // Case 2: Validating order data before sending to backend
  const requiredFields = ['customerId', 'measureId', 'tailorId', 'shopName', 'orderDate', 'deliveryDate', 'status'];

  for (const field of requiredFields) {
    if (!orderData[field]) {
      console.error(`Missing required field in order data: ${field}`);
      return false;
    }
  }

  // Additional validation for numeric fields
  if (!Number.isInteger(orderData.customerId) ||
      !Number.isInteger(orderData.measureId) ||
      !Number.isInteger(orderData.tailorId)) {
    console.error('Invalid numeric fields in order data');
    return false;
  }

  return true;
}

sendMeasurementData(): void {
  if (!this.billDetails) {
    console.error('Bill details not generated');
    return;
  }

  // Format the design data
  const designData = {
    willProvideCloth: this.designForm.get('willProvideCloth')?.value,
    clothType: this.designForm.get('clothType')?.value || '',
    clothColor: this.designForm.get('clothColor')?.value || '',
    neckTypes: this.designForm.get('neckTypes')?.value,
    sleeveTypes: this.designForm.get('sleeveTypes')?.value,
    cuts: this.designForm.get('cuts')?.value,
    otherOptions: this.designForm.get('otherOptions')?.value
  };

  // Format the measurements data
  const measurementsData = Object.keys(this.measurementForm.value).reduce((acc, key) => {
    acc[key] = this.measurementForm.get(key)?.value;
    return acc;
  }, {} as any);

  const measurementData = {
    userId: this.billDetails.customerId,
    tailorId: this.billDetails.tailorId,
    gender: this.genderForm.get('gender')?.value?.toUpperCase(),
    category: this.selectedDress.name,
    design: JSON.stringify(designData),
    measurements: JSON.stringify(measurementsData),
    price: this.selectedShop.price
  };

  console.log('Sending measurement data:', measurementData);

  this.measurementService.createMeasurement(measurementData).subscribe({
    next: (response) => {
      if (response && response.measurement_id) {
        console.log('Created measurement with ID:', response.measurement_id);
        this.sendOrderData(response.measurement_id);
      } else {
        console.error('Invalid response:', response);
        this.toastService.show('Error creating measurement', 'error');
      }
    },
    error: (error) => {
      console.error('Error creating measurement:', error);
      this.toastService.show('Failed to create measurement', 'error');
    }
  });
}

sendOrderData(measurementId: number): void {
  if (!this.billDetails) {
    console.error('Bill details not generated');
    return;
  }

  if (!measurementId) {
    console.error('No valid measurement ID provided');
    return;
  }

  // Format order data with all required fields
  const orderData: OrderData = {
    clothType: this.designForm.get('clothType')?.value || 'Not Specified',
    clothColor: this.designForm.get('clothColor')?.value || 'Not Specified',
    customerId: this.billDetails.customerId,
    orderDate: new Date().toISOString(),
    measureId: measurementId, // Use the measurement ID from the measurement creation
    deliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    shopName: this.billDetails.shopName,
    status: 'YET_TO_PICK_UP',
    tailorId: this.billDetails.tailorId, // Use tailorId from billDetails
    willProvideCloth: this.designForm.get('willProvideCloth')?.value || true
  };

  console.log('Sending order data:', orderData);

  this.orderService.createOrder(orderData).subscribe({
    next: (response) => {
      console.log('Order data sent successfully:', response);

      // Update billDetails with the order ID from response
      if (response && response.orderId) {
        this.billDetails.orderId = response.orderId;
        console.log('Updated bill details with order ID:', this.billDetails);
      }

      this.toastService.show('Order placed successfully!', 'success');
      this.router.navigate(['/user-home']);
    },
    error: (error) => {
      console.error('Error sending order data:', error);
      this.toastService.show('Failed to place order. Please try again.', 'error');
    }
  });
}
}
