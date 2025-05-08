export class User {
  id?: number; // Optional for registration
  name: string;
  email: string;
  address:string;
  phoneNumber: string;
  password: string;
  role?: string; // Optional for registration
  createdAt?: Date;
  username? : string;

  constructor(
    name: string,
    email: string,
    address:string,
    phoneNumber: string,
    password: string,
    id?: number,
    role?: string,
    createdAt?: Date,
    username? : string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.username = username;
  }
}

export class LoginRequest {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

