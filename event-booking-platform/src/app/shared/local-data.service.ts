import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, Booking, User } from './modal/event.modal'; // Importing interfaces

@Injectable({
  providedIn: 'root',
})
export class LocalDataService {
  private readonly jsonUrl = 'assets/data.json'; // Path to JSON file
  private data: { events: Event[]; users: User[] } | null = null; // Store JSON data in memory

  constructor(private http: HttpClient) {}

  /**
   * Loads JSON data and caches it
   */
  private loadData(): Observable<{ events: Event[]; users: User[] }> {
    if (this.data) return of(this.data); // Return cached data

    return this.http.get<{ events: Event[]; users: User[] }>(this.jsonUrl).pipe(
      map((response) => {
        this.data = response; // Cache data
        return this.data;
      })
    );
  }

  /**
   * Fetch all events
   */
  getEvents(): Observable<Event[]> {
    return this.loadData().pipe(map((data) => data.events));
  }

  /**
   * Fetch single event by ID
   */
  getEventById(id: number): Observable<Event | undefined> {
    return this.getEvents().pipe(map((events) => events.find((event) => event.id === id)));
  }

  /**
   * Add a new event
   */
  addEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this.loadData().pipe(
      map((data) => {
        const newEvent: Event = { id: data.events.length + 1, ...event }; // Auto-increment ID
        data.events.push(newEvent);
        return newEvent;
      })
    );
  }

  /**
   * Delete an event
   */
  deleteEvent(id: number): Observable<Event[]> {
    return this.loadData().pipe(
      map((data) => {
        data.events = data.events.filter((event) => event.id !== id);
        return data.events;
      })
    );
  }

  /**
   * Fetch all users
   */
  getUsers(): Observable<User[]> {
    return this.loadData().pipe(map((data) => data.users));
  }

  /**
   * Fetch all bookings from localStorage
   */
  getBookings(): Observable<Booking[]> {
    const storedBookings = localStorage.getItem('bookings');
    return of(storedBookings ? JSON.parse(storedBookings) : []);
  }

  /**
   * Book an event
   */
  bookEvent(event: Event, userEmail: string): Observable<Booking> {
    return this.getBookings().pipe(
      map((bookings) => {
        const { id: _, ...eventData } = event; // Exclude the existing event id
        const newBooking: Booking = { id: bookings.length + 1, userEmail, ...eventData };
        bookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings)); // Save to localStorage
        return newBooking;
      })
    );
  }
  

  /**
   * Cancel a booking
   */
  cancelBooking(id: number): Observable<Booking[]> {
    return this.getBookings().pipe(
      map((bookings) => {
        const updatedBookings = bookings.filter((booking) => booking.id !== id);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings)); // Save updated list
        return updatedBookings;
      })
    );
  }
}
