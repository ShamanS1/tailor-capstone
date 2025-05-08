export class Tailor {
  tailorId?: number; // Optional for registration
  name: string;
  shopName: string;
  location: Location;
  email: string;
  phone: string;
  password: string;
  status?: string; // Optional for registration
  dress: Dress[];
  role?: string; // Optional for registration


  constructor(
    name: string,
    shopName: string,
    location: Location,
    email: string,
    phone: string,
    password: string,
    dress: Dress[],
    tailorId?: number,
    status?: string,
    role?: string
  ) {
    this.tailorId = tailorId;
    this.name = name;
    this.shopName = shopName;
    this.location = location;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.status = status;
    this.dress = dress;
    this.role = role;
  }
}

export class Location {
  latitude: number;
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

export class Dress {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

