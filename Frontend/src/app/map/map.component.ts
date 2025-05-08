import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() initialLocation: [number, number] = [51.505, -0.09]; // Default location (London)
  @Input() isEditing: boolean = false; // Whether the map is editable
  @Output() locationChanged = new EventEmitter<[number, number]>(); // Emit new location

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;

  constructor() {}

  ngOnInit(): void {
    // Fix for Leaflet's default icon path
    this.fixLeafletIconPath();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  // Fix for Leaflet's default icon path
  private fixLeafletIconPath(): void {
    const iconRetinaUrl = 'assets/images/leaflet/marker-icon-2x.png';
    const iconUrl = 'assets/images/leaflet/marker-icon.png';
    const shadowUrl = 'assets/images/leaflet/marker-shadow.png';

    // Override Leaflet's default icon path
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });
  }

  // Initialize the map
  private initMap(): void {
    // Initialize the map
    this.map = L.map('map').setView(this.initialLocation, 13);

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Add a marker
    this.marker = L.marker(this.initialLocation, { draggable: this.isEditing }).addTo(this.map);

    // Emit location changes when the marker is dragged
    if (this.isEditing) {
      this.marker.on('dragend', () => {
        const newLocation = this.marker!.getLatLng();
        this.locationChanged.emit([newLocation.lat, newLocation.lng]);
      });
    }
  }

  // Method to update the map location
  public updateLocation(newLocation: [number, number]): void {
    if (this.map && this.marker) {
      this.map.setView(newLocation, 13); // Set the map view to the new location
      this.marker.setLatLng(newLocation); // Move the marker to the new location
    }
  }
}
