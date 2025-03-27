export interface Event {
    id: number;
    name: string;
    location: string;
    date: string;
    price: number;
    description?: string;
  }
  
  export interface Booking extends Event {
    userEmail: string;
  }
  
  export interface User {
    email: string;
    role: 'admin' | 'user';
  }
  